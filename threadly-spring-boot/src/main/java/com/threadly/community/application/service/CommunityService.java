package com.threadly.community.application.service;

import com.threadly.community.CommunityCreatedEvent;
import com.threadly.community.CreateCommunityRequest;
import com.threadly.community.application.usecase.CommunityInternalApi;
import com.threadly.community.domain.Community;
import com.threadly.community.infrastructure.CommunityRepository;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.MembershipExternalApi;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
class CommunityService implements CommunityInternalApi {

  private final CommunityRepository communityRepository;
  private final MembershipExternalApi membershipExternalApi;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  public Optional<Community> getCommunity(UUID id) {
    return communityRepository.findById(id);
  }

  @Override
  public List<Community> getAllCommunity() {
    return communityRepository.findAll();
  }

  @Override
  public UUID createCommunity(CreateCommunityRequest request, UUID userId) {
    var community = Community.from(request);

    communityRepository.save(community);

    membershipExternalApi.addMember(community.getId(), userId, CommunityRole.OWNER, userId);

    eventPublisher.publishEvent(new CommunityCreatedEvent(
        community.getId(),
        community.getTitle(),
        userId
    ));

    log.info("Community created title={} userId={}", community.getTitle(), userId);

    return community.getId();
  }
}
