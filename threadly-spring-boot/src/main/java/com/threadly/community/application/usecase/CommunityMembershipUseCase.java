package com.threadly.community.application.usecase;

import com.threadly.membership.CommunityMembershipDTO;
import com.threadly.membership.CommunityMembershipInviteDTO;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface CommunityMembershipUseCase {

  void follow(UUID communityId, UUID userId);

  void unFollow(UUID communityId, UUID userId);

  void inviteModUser(UUID communityId, UUID userId, UUID actorId);

  Slice<CommunityMembershipDTO> getCommunityMemberships(UUID communityId, Pageable pageable,
      Optional<String> role);

  Slice<CommunityMembershipInviteDTO> getCommunityMembershipInvites(UUID communityId,
      Pageable pageable,
      Optional<String> role);

  Optional<CommunityMembershipInviteDTO> getUserMembershipInvite(UUID communityId, UUID actorId);

  void acceptUserMembershipInvite(UUID communityId, UUID userId);

  void rejectUserMembershipInvite(UUID communityId, UUID userId);

  void removeUserMembershipInvite(UUID communityId, UUID userId, UUID actorId);
}
