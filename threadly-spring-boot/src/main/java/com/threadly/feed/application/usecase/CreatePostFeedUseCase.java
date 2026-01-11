package com.threadly.feed.application.usecase;

import java.util.UUID;

interface CreatePostFeedUseCase {

  void createPostFeed(UUID communityId, UUID postId, UUID userId);
}
