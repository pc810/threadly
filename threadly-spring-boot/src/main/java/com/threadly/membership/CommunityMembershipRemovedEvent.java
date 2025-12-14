package com.threadly.membership;

public record CommunityMembershipRemovedEvent(CommunityMembershipId communityMemberId,
                                              CommunityRole role) {

}
