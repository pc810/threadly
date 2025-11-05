package com.threadly.post.application.usercase;

import com.threadly.post.domain.Post;
import java.util.Optional;
import java.util.UUID;

public interface GetPostUseCase {

  Optional<Post> getPost(UUID id);
}
