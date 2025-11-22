package com.threadly.community.application.usecase;

import java.util.UUID;

public interface CanActionUseCase {
  boolean canViewCommunity(UUID resourceId, UUID actorId);
}
