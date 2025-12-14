package com.threadly.membership;

import java.util.UUID;

public record CommunityMembershipCreatedEvent(UUID communityId, UUID userId, CommunityRole role,
                                              UUID addedBy) {

}
