package com.threadly.post.application.usercase;

import com.threadly.post.CreatePostRequest;
import java.util.UUID;

public interface CreatePostUseCase {

  UUID createPost(CreatePostRequest request, UUID userId);
}
