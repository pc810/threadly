package com.threadly.membership.application.service;


import com.threadly.membership.CommunityMembershipCreatedEvent;
import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.CommunityMembershipRemovedEvent;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.MembershipExternalApi;
import com.threadly.membership.domain.CommunityMembership;
import com.threadly.membership.domain.exception.MembershipNotFoundException;
import com.threadly.membership.infrastructure.persistence.CommunityMembershipRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
class MembershipService implements MembershipExternalApi {

  private final CommunityMembershipRepository repository;
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
      repository.save(
          CommunityMembership.from(communityMemberId, role, addedBy)
      );

      var event = new CommunityMembershipCreatedEvent(
          communityId,
          userId,
          role,
          addedBy
      );

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
  @Transactional
  public void removeMember(UUID communityId, UUID userId) {
    var communityMemberId = CommunityMembershipId.from(communityId, userId);

    var communityMembership = repository.findById(communityMemberId)
        .orElseThrow(() -> MembershipNotFoundException.from(communityMemberId));

    if (communityMembership.getRole() == CommunityRole.AUTHOR) {
      throw new AccessDeniedException("cannot perform this action");
    }

    repository.delete(communityMemberId);

    var event = new CommunityMembershipRemovedEvent(
        communityMemberId,
        communityMembership.getRole()
    );

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
  public List<CommunityMembership> getCommunitiesForUser(UUID userId) {
    return repository.findByUserId(userId);
  }

  @Override
  public Optional<CommunityRole> getRole(UUID communityId, UUID actorId) {
    return repository.findById(CommunityMembershipId.from(communityId, actorId)).map(
        CommunityMembership::getRole
    );
  }
}
