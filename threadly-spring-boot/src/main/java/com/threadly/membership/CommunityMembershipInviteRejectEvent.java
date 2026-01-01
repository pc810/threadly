package com.threadly.membership;

import java.time.Instant;

public record CommunityMembershipInviteRejectEvent(CommunityMembershipId id, Instant rejectedAt) {

  public static CommunityMembershipInviteRejectEvent from(CommunityMembershipId id) {
    return new CommunityMembershipInviteRejectEvent(id, Instant.now());
  }
}
