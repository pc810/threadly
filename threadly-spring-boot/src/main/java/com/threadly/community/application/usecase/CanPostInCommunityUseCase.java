package com.threadly.community.application.usecase;

import java.util.UUID;

public interface CanPostInCommunityUseCase {

  boolean canPostInCommunity(UUID communityId, UUID actorId);
}
