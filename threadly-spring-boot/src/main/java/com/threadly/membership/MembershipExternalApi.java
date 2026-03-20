package com.threadly.membership;

import com.threadly.membership.domain.CommunityMembership;
import com.threadly.membership.domain.CommunityMembershipInvite;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface MembershipExternalApi {

  boolean ownsCommunity(UUID communityId, UUID userId);

  boolean isMember(UUID communityId, UUID userId);

  void addMember(UUID communityId, UUID userId, CommunityRole role, UUID addedBy);

  Optional<CommunityMembershipDTO> getMembership(UUID communityId, UUID userId);

  void removeMember(UUID communityId, UUID userId);

  List<CommunityMembershipDTO> getMembers(UUID communityId);

  Slice<CommunityMembershipDTO> getMembers(UUID communityId, Pageable pageable,
      Optional<String> role);

  List<CommunityMembership> getCommunitiesForUser(UUID userId);

  Optional<CommunityRole> getRole(UUID communityId, UUID actorId);

  void inviteUser(UUID communityId, CommunityRole role, UUID userId, UUID invitedBy);

  boolean isUserInvited(UUID communityId, CommunityRole role, UUID userId);

  Slice<CommunityMembershipInviteDTO> getInvitedMembers(UUID communityId, Pageable pageable,
      Optional<String> role);

  Optional<CommunityMembershipInvite> getUserInvited(UUID communityId, UUID actorId);

  void rejectInvite(UUID communityId, UUID userId);

  void acceptInvite(UUID communityId, UUID userId);

  void removeInvite(UUID communityId, UUID userId,UUID actorId);
}
