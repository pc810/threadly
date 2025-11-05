package com.threadly.post.infrastructure.persistence;

import com.threadly.post.domain.Post;
import java.util.Optional;
import java.util.UUID;

public interface PostRepository {

  Optional<Post> findById(UUID id);

  void save(Post post);
}
