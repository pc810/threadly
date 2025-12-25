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
import com.threadly.community.infrastructure.CommunityRepository;
import com.threadly.membership.CommunityMembershipDTO;
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
  public Slice<CommunityMembershipDTO> getCommunityMemberships(UUID communityId,
      Pageable pageable, Optional<String> role) {
    return membershipExternalApi.getMembers(communityId, pageable, role);
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

    updateCommunityMetaDTO.title().ifPresent(community::setTitle);
    updateCommunityMetaDTO.description().ifPresent(community::setDescription);
    updateCommunityMetaDTO.isNsfw().ifPresent(community::setNsfw);

    communityRepository.save(community);
  }
}
