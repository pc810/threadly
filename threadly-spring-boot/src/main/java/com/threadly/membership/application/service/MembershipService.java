package com.threadly.membership.application.service;


import com.threadly.membership.CommunityInviteCreatedEvent;
import com.threadly.membership.CommunityMembershipCreatedEvent;
import com.threadly.membership.CommunityMembershipDTO;
import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.CommunityMembershipInviteDTO;
import com.threadly.membership.CommunityMembershipInviteRejectEvent;
import com.threadly.membership.CommunityMembershipRemovedEvent;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.MembershipExternalApi;
import com.threadly.membership.domain.CommunityMembership;
import com.threadly.membership.domain.CommunityMembershipInvite;
import com.threadly.membership.domain.CommunityMembershipInviteSpecs;
import com.threadly.membership.domain.CommunityMembershipSpecs;
import com.threadly.membership.domain.exception.MembershipNotFoundException;
import com.threadly.membership.infrastructure.persistence.CommunityMembershipInviteRepository;
import com.threadly.membership.infrastructure.persistence.CommunityMembershipRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
class MembershipService implements MembershipExternalApi {

  private final CommunityMembershipRepository repository;
  private final CommunityMembershipInviteRepository inviteRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  public boolean ownsCommunity(UUID communityId, UUID userId) {
//    return repository.findById(CommunityMembershipId.from(communityId, userId))
//        .map(CommunityMembership::getRole)
//        .map(role -> role == CommunityRole.OWNER)
//        .orElse(false);
    return repository.existsIdAndRole(CommunityMembershipId.from(communityId, userId),
        CommunityRole.AUTHOR);
  }

  @Override
  public boolean isMember(UUID communityId, UUID userId) {
    return repository.existsById(CommunityMembershipId.from(communityId, userId));
  }

  @Override
  @Transactional
  public void addMember(UUID communityId, UUID userId, CommunityRole role, UUID addedBy) {

    var communityMemberId = CommunityMembershipId.from(communityId, userId);

    if (!repository.existsById(communityMemberId)) {
      log.info("adding user={} to community={} role={} addedBy={}", userId, communityId, role,
          addedBy);
      repository.save(CommunityMembership.from(communityMemberId, role, addedBy));

      var event = new CommunityMembershipCreatedEvent(communityId, userId, role, addedBy);

//      permissionClient.addRelation(
//          ResourceType.COMMUNITY,
//          event.communityId(),
//          event.role().isAuthor() ? ResourceRelation.Community.OWNER
//              : ResourceRelation.Community.MEMBER,
//          ResourceType.USER,
//          event.userId()
//      );
      eventPublisher.publishEvent(event);
    }
  }

  @Override
  public Optional<CommunityMembership> getMembership(UUID communityId, UUID userId) {
    return repository.findById(CommunityMembershipId.from(communityId, userId));
  }

  @Override
  @Transactional
  public void removeMember(UUID communityId, UUID userId) {
    var communityMemberId = CommunityMembershipId.from(communityId, userId);

    var communityMembership = repository.findById(communityMemberId)
        .orElseThrow(() -> MembershipNotFoundException.from(communityMemberId));

    if (communityMembership.getRole() == CommunityRole.AUTHOR) {
      throw new AccessDeniedException("cannot perform this action");
    }

    repository.delete(communityMemberId);

    var event = new CommunityMembershipRemovedEvent(communityMemberId,
        communityMembership.getRole());

//    permissionClient.removeRelation(
//        ResourceType.COMMUNITY,
//        event.communityMemberId().communityId(),
//        event.role().isAuthor() ? ResourceRelation.Community.OWNER
//            : ResourceRelation.Community.MEMBER,
//        ResourceType.USER,
//        event.communityMemberId().userId()
//    );
    eventPublisher.publishEvent(event);
  }

  @Override
  public List<CommunityMembership> getMembers(UUID communityId) {
    return repository.findByCommunityId(communityId);
  }

  @Override
  public Page<CommunityMembershipDTO> getMembers(UUID communityId, Pageable pageable,
      Optional<String> role) {

    Specification<CommunityMembership> spec = Specification.where(
        CommunityMembershipSpecs.hasCommunityId(communityId));

    if (role.isPresent()) {
      spec = spec.and(CommunityMembershipSpecs.hasRole(CommunityRole.valueOf(role.get())));
    }

    Page<CommunityMembership> page = repository.findAll(spec, pageable);

    return page.map(CommunityMembershipDTO::from);
  }

  @Override
  public List<CommunityMembership> getCommunitiesForUser(UUID userId) {
    return repository.findByUserId(userId);
  }

  @Override
  public Optional<CommunityRole> getRole(UUID communityId, UUID actorId) {
    return repository.findById(CommunityMembershipId.from(communityId, actorId))
        .map(CommunityMembership::getRole);
  }

  @Override
  public void inviteUser(UUID communityId, CommunityRole role, UUID userId, UUID invitedBy) {
    var membershipInvite = CommunityMembershipInvite.from(
        CommunityMembershipId.from(communityId, userId), role, invitedBy);

    inviteRepository.save(membershipInvite);

    eventPublisher.publishEvent(CommunityInviteCreatedEvent.from(membershipInvite));
  }

  @Override
  public boolean isUserInvited(UUID communityId, CommunityRole role, UUID userId) {
    var inviteDto = inviteRepository.findById(CommunityMembershipId.from(communityId, userId));

    return inviteDto.isPresent();
  }

  @Override
  public Slice<CommunityMembershipInviteDTO> getInvitedMembers(UUID communityId, Pageable pageable,
      Optional<String> role) {

    Specification<CommunityMembershipInvite> spec = Specification.where(
        CommunityMembershipInviteSpecs.hasCommunityId(communityId));

    if (role.isPresent()) {
      spec = spec.and(CommunityMembershipInviteSpecs.hasRole(CommunityRole.valueOf(role.get())));
    }

    return inviteRepository.findAll(spec, pageable).map(CommunityMembershipInviteDTO::from);
  }

  @Override
  public Optional<CommunityMembershipInvite> getUserInvited(UUID communityId, UUID actorId) {
    return inviteRepository.findById(CommunityMembershipId.from(communityId, actorId));
  }

  @Override
  public void rejectInvite(UUID communityId, UUID userId) {
    var inviteId = CommunityMembershipId.from(communityId, userId);

    var invite = inviteRepository.findById(inviteId)
        .orElseThrow(() -> MembershipNotFoundException.from(inviteId));

    inviteRepository.delete(invite);
    eventPublisher.publishEvent(CommunityMembershipInviteRejectEvent.from(inviteId));
  }

  @Override
  public void acceptInvite(UUID communityId, UUID userId) {
    var inviteId = CommunityMembershipId.from(communityId, userId);

    var invite = inviteRepository.findById(inviteId)
        .orElseThrow(() -> MembershipNotFoundException.from(inviteId));

    inviteRepository.delete(invite);
    var membershipOps = getMembership(communityId, userId);
    membershipOps.ifPresentOrElse(
        membership -> {
          membership.updateRole(invite.getRole());
          repository.save(membership);
        },
        () -> addMember(inviteId.communityId(), inviteId.userId(), invite.getRole(),
            invite.getInvitedBy())
    );

  }

  @Override
  public void removeInvite(UUID communityId, UUID userId,UUID actorId) {
    var inviteId = CommunityMembershipId.from(communityId, userId);

    var invite = inviteRepository.findById(inviteId)
        .orElseThrow(() -> MembershipNotFoundException.from(inviteId));

    inviteRepository.delete(invite);
  }
}
