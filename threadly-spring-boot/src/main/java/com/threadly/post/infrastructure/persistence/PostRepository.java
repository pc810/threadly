package com.threadly.post.infrastructure.persistence;

import com.threadly.post.domain.Post;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostRepository {

  Optional<Post> findById(UUID id);

  List<Post> findAll();

  void save(Post post);
}
