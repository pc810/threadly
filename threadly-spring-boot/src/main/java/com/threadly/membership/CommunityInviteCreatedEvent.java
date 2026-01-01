package com.threadly.membership;

import com.threadly.membership.domain.CommunityMembershipInvite;
import java.util.UUID;

public record CommunityInviteCreatedEvent(UUID communityId, UUID userId, UUID invitedBy) {

  public static CommunityInviteCreatedEvent from(CommunityMembershipInvite cmi) {
    return new CommunityInviteCreatedEvent(
        cmi.getId().communityId(),
        cmi.getId().userId(),
        cmi.getInvitedBy()
    );
  }
}
