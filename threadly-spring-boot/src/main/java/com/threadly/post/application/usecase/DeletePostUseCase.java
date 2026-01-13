package com.threadly.post.application.usecase;

import java.util.UUID;

public interface DeletePostUseCase {

  boolean deletePost(UUID postId, UUID actorId);
}
