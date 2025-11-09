package com.threadly.community.application.usecase;

import com.threadly.community.CreateCommunityRequest;
import java.util.UUID;

public interface CreateCommunityUseCase {
  UUID createCommunity(CreateCommunityRequest request, UUID userId);
}
