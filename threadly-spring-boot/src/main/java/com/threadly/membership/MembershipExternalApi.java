package com.threadly.membership;

import com.threadly.membership.domain.CommunityMembership;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface MembershipExternalApi {

  boolean ownsCommunity(UUID communityId, UUID userId);

  boolean isMember(UUID communityId, UUID userId);

  void addMember(UUID communityId, UUID userId, CommunityRole role, UUID addedBy);

  void removeMember(UUID communityId, UUID userId);

  List<CommunityMembership> getMembers(UUID communityId);

  Slice<CommunityMembershipDTO> getMembers(UUID communityId, Pageable pageable,Optional<String> role);

  List<CommunityMembership> getCommunitiesForUser(UUID userId);

  Optional<CommunityRole> getRole(UUID communityId, UUID actorId);
}
