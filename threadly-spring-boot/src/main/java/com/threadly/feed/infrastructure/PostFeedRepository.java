package com.threadly.feed.infrastructure;

import com.threadly.feed.domain.PostFeed;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface PostFeedRepository {

  Slice<PostFeed> getPostFeed(UUID userId, Instant cursorTime, Pageable pageable);

  void save(PostFeed postFeed);
}
