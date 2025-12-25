package com.threadly.community.application.usecase;

import com.threadly.membership.CommunityMembershipDTO;
import com.threadly.membership.CommunityRole;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface CommunityMembershipUseCase {

  void follow(UUID communityId, UUID userId);

  void unFollow(UUID communityId, UUID userId);

  Slice<CommunityMembershipDTO> getCommunityMemberships(UUID communityId, Pageable pageable,
      Optional<String> role);
}
