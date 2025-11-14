package com.threadly.post.application.usecase;

import com.threadly.post.CreatePostRequest;
import java.util.UUID;

public interface CreatePostUseCase {

  UUID createPost(CreatePostRequest request, UUID userId);
}
