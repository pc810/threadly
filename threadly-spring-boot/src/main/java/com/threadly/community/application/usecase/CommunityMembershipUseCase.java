package com.threadly.community.application.usecase;

import java.util.UUID;

public interface CommunityMembershipUseCase {

  void follow(UUID communityId, UUID userId);

  void unFollow(UUID communityId, UUID userId);
}
