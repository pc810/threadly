package com.threadly.post.infrastructure.persistence;

import com.threadly.post.domain.PostLink;
import java.util.Optional;
import java.util.UUID;

public interface PostLinkRepository {

  Optional<PostLink> findById(UUID id);

  Optional<PostLink> findByPostId(UUID postId);

  void save(PostLink postLink);
}
