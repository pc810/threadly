package com.threadly.community.application.service;

import com.threadly.community.CommunityExternalApi;
import com.threadly.community.application.usecase.CommunityInternalApi;
import com.threadly.community.domain.exception.CommunityNotFoundException;
import com.threadly.membership.MembershipExternalApi;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class CommunityExternalService implements CommunityExternalApi {

  private final CommunityInternalApi communityInternalApi;

  private final MembershipExternalApi membershipService;

  @Override
  public boolean canPostInCommunity(UUID communityId, UUID actorId) {
    var community = communityInternalApi.getCommunity(communityId)
        .orElseThrow(() -> new CommunityNotFoundException(communityId));

    if (membershipService.isMember(communityId, actorId)) {
      return true;
    }

    return community.isPublic();

//    if (community.isRestricted()) {
//      return community.hasMember(actorId);
//    }
  }
}
