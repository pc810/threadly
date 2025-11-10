package com.threadly.membership;

import com.threadly.membership.domain.CommunityMembership;
import java.util.List;
import java.util.UUID;

public interface MembershipExternalApi {

  boolean ownsCommunity(UUID communityId, UUID userId);

  boolean isMember(UUID communityId, UUID userId);

  void addMember(UUID communityId, UUID userId, CommunityRole role, UUID addedBy);

  void removeMember(UUID communityId, UUID userId);

  List<CommunityMembership> getMembers(UUID communityId);

  List<CommunityMembership> getCommunitiesForUser(UUID userId);

}
