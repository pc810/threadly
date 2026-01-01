package com.threadly.membership;

import com.threadly.membership.domain.CommunityMembershipInvite;
import java.time.Instant;
import java.util.UUID;

public record CommunityMembershipInviteDTO(
    CommunityMembershipId id,
    CommunityRole role,
    UUID invitedBy,
    Instant createdAt
) {

  public static CommunityMembershipInviteDTO from(
      CommunityMembershipInvite communityMembershipInvite) {
    return new CommunityMembershipInviteDTO(
        communityMembershipInvite.getId(),
        communityMembershipInvite.getRole(),
        communityMembershipInvite.getInvitedBy(),
        communityMembershipInvite.getCreatedAt()
    );
  }
}
