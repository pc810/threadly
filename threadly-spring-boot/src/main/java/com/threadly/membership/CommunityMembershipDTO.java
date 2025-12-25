package com.threadly.membership;

import com.threadly.membership.domain.CommunityMembership;
import java.time.Instant;

public record CommunityMembershipDTO(
    CommunityMembershipId id,
    CommunityRole role,
    Instant joinedAt
) {

  public static CommunityMembershipDTO from(CommunityMembership m) {
    return new CommunityMembershipDTO(
        m.getId(),
        m.getRole(),
        m.getCreatedAt()
    );
  }
}
