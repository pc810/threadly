package com.threadly.feed.application.usecase;

import java.util.UUID;

public interface DeletePostFeedUseCase {

  void deletePostById(UUID postId);
}
