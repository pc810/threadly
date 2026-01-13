package com.threadly.post.infrastructure.persistence.adaptor;

import com.threadly.post.domain.PostLink;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPostLinkRepository extends JpaRepository<PostLink, UUID> {

  Optional<PostLink> findByPostId(UUID postId);

  void deleteByPostId(UUID postId);
}
