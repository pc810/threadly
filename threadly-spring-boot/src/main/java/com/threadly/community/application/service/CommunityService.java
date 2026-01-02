package com.threadly.community.application.service;

import com.threadly.common.AuthRole;
import com.threadly.common.ResourcePermission;
import com.threadly.common.ResourceType;
import com.threadly.community.CommunityCreatedEvent;
import com.threadly.community.CommunityExternalApi;
import com.threadly.community.CommunityVisibility;
import com.threadly.community.CreateCommunityRequest;
import com.threadly.community.UpdateCommunityMetaDTO;
import com.threadly.community.UpdateCommunityVisibilityEvent;
import com.threadly.community.application.usecase.CommunityInternalApi;
import com.threadly.community.domain.Community;
import com.threadly.community.domain.exception.CommunityNotFoundException;
import com.threadly.community.domain.exception.MembershipAlreadyExistsException;
import com.threadly.community.domain.exception.MembershipInviteExistsException;
import com.threadly.community.infrastructure.CommunityRepository;
import com.threadly.membership.CommunityMembershipDTO;
import com.threadly.membership.CommunityMembershipInviteDTO;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.MembershipExternalApi;
import com.threadly.permission.PermissionClient;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
class CommunityService implements CommunityInternalApi, CommunityExternalApi {

  private final CommunityRepository communityRepository;
  private final MembershipExternalApi membershipExternalApi;
  private final ApplicationEventPublisher eventPublisher;
  private final PermissionClient permissionClient;

  @Override
  public Optional<Community> getCommunity(UUID id) {
    return communityRepository.findById(id);
  }

  @Override
  public Optional<Community> getCommunityByName(String name) {
    return communityRepository.findByName(name);
  }

  @Override
  public List<Community> getAllCommunity() {
    return communityRepository.findAll();
  }

  @Override
  public List<Community> getAllCommunityByUser(UUID userId) {
    var communityIdUserCanView = permissionClient.lookupResources(ResourceType.COMMUNITY,
        ResourcePermission.Community.VIEW,
        ResourceType.USER, userId);
//    log.info("resources={}", communityIdUserCanView);
    return communityIdUserCanView.stream()
        .map(id -> getCommunity(UUID.fromString(id)))
        .flatMap(Optional::stream)
        .toList();
  }

  @Override
  public UUID createCommunity(CreateCommunityRequest request, UUID userId) {
    var community = Community.from(request);

    communityRepository.save(community);

    membershipExternalApi.addMember(community.getId(), userId, CommunityRole.AUTHOR, userId);

    eventPublisher.publishEvent(new CommunityCreatedEvent(
        community.getId(),
        community.getTitle(),
        community.getVisibility(),
        userId
    ));

    log.info("Community created title={} userId={}", community.getTitle(), userId);

    return community.getId();
  }


  @Override
  public boolean canPostInCommunity(UUID communityId, UUID actorId) {
    var community = getCommunity(communityId)
        .orElseThrow(() -> new CommunityNotFoundException(communityId));

    if (membershipExternalApi.isMember(communityId, actorId)) {
      return true;
    }

    return community.isPublic();

  }

  @Override
  public boolean checkAccess(UUID communityId, AuthRole authRole) {
    var community = getCommunity(communityId)
        .orElseThrow(() -> CommunityNotFoundException.byId(communityId));

    if (community.isPublic()) {
      return true;
    }

    return switch (authRole) {
      case MEMBER, MOD, AUTHOR -> true;
      default -> false;
    };
  }

  @Override
  public boolean checkModAccess(UUID communityId, AuthRole authRole) {
    getCommunity(communityId)
        .orElseThrow(() -> CommunityNotFoundException.byId(communityId));

    return switch (authRole) {
      case MOD, AUTHOR -> true;
      default -> false;
    };
  }

  @Override
  public boolean checkOwnerAccess(UUID communityId, AuthRole authRole) {
    getCommunity(communityId)
        .orElseThrow(() -> CommunityNotFoundException.byId(communityId));

    return authRole == AuthRole.AUTHOR;
  }

  @Override
  public boolean checkMembershipViewAccess(UUID communityId, AuthRole authRole) {
    var community = getCommunity(communityId)
        .orElseThrow(() -> CommunityNotFoundException.byId(communityId));

    if (community.isPublic()) {
      return true;
    }

    return switch (authRole) {
      case MEMBER, MOD, AUTHOR -> true;
      default -> false;
    };
  }

  @Override
  public boolean checkCanInviteModUser(UUID communityId, UUID actorId) {
    return permissionClient.checkPermission(
        ResourceType.COMMUNITY,
        communityId,
        ResourcePermission.Community.CAN_INVITE,
        ResourceType.USER,
        actorId
    );
  }


  @Override
  public Optional<CommunityRole> getRole(UUID communityId, UUID actorId) {

    var community = getCommunity(communityId)
        .orElseThrow(() -> CommunityNotFoundException.byId(communityId));

    return membershipExternalApi.getRole(communityId, actorId);
  }

  @Override
  public void follow(UUID communityId, UUID userId) {
    membershipExternalApi.addMember(communityId, userId, CommunityRole.MEMBER, userId);
  }

  @Override
  public void unFollow(UUID communityId, UUID userId) {
    membershipExternalApi.removeMember(communityId, userId);
  }

  @Override
  public void inviteModUser(UUID communityId, UUID userId, UUID invitedBy) {
    var communityMembership = membershipExternalApi.getMembership(communityId, userId);

    communityMembership.ifPresent(membership -> {
      if (membership.hasModOwnerPrivilege()) {
        throw MembershipAlreadyExistsException.from(communityId, userId);
      }
    });

    if (membershipExternalApi.isUserInvited(communityId, CommunityRole.MOD, userId)) {
      throw MembershipInviteExistsException.from(communityId, userId);
    }

    membershipExternalApi.inviteUser(communityId, CommunityRole.MOD, userId, invitedBy);
  }

  @Override
  public Slice<CommunityMembershipDTO> getCommunityMemberships(UUID communityId,
      Pageable pageable, Optional<String> role) {
    return membershipExternalApi.getMembers(communityId, pageable, role);
  }

  @Override
  public Slice<CommunityMembershipInviteDTO> getCommunityMembershipInvites(UUID communityId,
      Pageable pageable, Optional<String> role) {
    return membershipExternalApi.getInvitedMembers(communityId, pageable, role);
  }

  @Override
  public Optional<CommunityMembershipInviteDTO> getUserMembershipInvite(UUID communityId,
      UUID actorId) {
    return membershipExternalApi.getUserInvited(communityId, actorId)
        .map(CommunityMembershipInviteDTO::from);
  }

  @Override
  public void acceptUserMembershipInvite(UUID communityId, UUID userId) {
    membershipExternalApi.acceptInvite(communityId, userId);
  }

  @Override
  public void rejectUserMembershipInvite(UUID communityId, UUID userId) {
    membershipExternalApi.rejectInvite(communityId, userId);
  }

  @Override
  public void removeUserMembershipInvite(UUID communityId, UUID userId, UUID actorId) {
    membershipExternalApi.removeInvite(communityId, userId, actorId);
  }


  @Override
  public void changeVisibility(UUID communityId, CommunityVisibility visibility) {
    var community = getCommunity(communityId).orElseThrow(
        () -> CommunityNotFoundException.byId(communityId));
    var currentVisibility = community.getVisibility();
    if (!currentVisibility.equals(visibility)) {
      community.setVisibility(visibility);
      communityRepository.save(community);

      eventPublisher.publishEvent(
          new UpdateCommunityVisibilityEvent(
              communityId,
              currentVisibility,
              visibility
          )
      );
    }
  }

  @Override
  public void updateCommunityMeta(UUID communityId, UpdateCommunityMetaDTO updateCommunityMetaDTO) {
    var community = getCommunity(communityId).orElseThrow(
        () -> CommunityNotFoundException.byId(communityId));

    if (updateCommunityMetaDTO.title() != null) {
      community.setTitle(updateCommunityMetaDTO.title());
    }
    if (updateCommunityMetaDTO.description() != null) {
      community.setDescription(updateCommunityMetaDTO.description());
    }
    if (updateCommunityMetaDTO.isNsfw() != null) {
      community.setNsfw(updateCommunityMetaDTO.isNsfw());
    }

    communityRepository.save(community);
  }
}
