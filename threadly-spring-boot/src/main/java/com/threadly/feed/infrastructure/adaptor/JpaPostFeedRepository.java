package com.threadly.feed.infrastructure.adaptor;

import com.threadly.feed.domain.PostFeed;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaPostFeedRepository extends JpaRepository<PostFeed, Long> {

  Slice<PostFeed> findByUserIdAndCreatedAtLessThanOrderByCreatedAtDesc(UUID userId, Instant cursorTime, Pageable pageable);

  void deleteByPostId(UUID postId);
}
