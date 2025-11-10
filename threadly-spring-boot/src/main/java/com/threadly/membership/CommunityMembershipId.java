package com.threadly.membership;

import jakarta.persistence.Embeddable;
import java.util.UUID;

@Embeddable
public record CommunityMembershipId(
    UUID communityId,
    UUID userId
) {

  public static CommunityMembershipId from(UUID communityId, UUID userId) {
    return new CommunityMembershipId(communityId, userId);
  }
}
