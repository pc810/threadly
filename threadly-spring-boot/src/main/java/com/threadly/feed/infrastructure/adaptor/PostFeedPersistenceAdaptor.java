package com.threadly.feed.infrastructure.adaptor;

import com.threadly.feed.domain.PostFeed;
import com.threadly.feed.infrastructure.PostFeedRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
class PostFeedPersistenceAdaptor implements PostFeedRepository {

  private final JpaPostFeedRepository repository;

  @Override
  public Slice<PostFeed> getPostFeed(UUID userId, Instant cursorTime, Pageable pageable) {
    return repository.findByUserIdAndCreatedAtLessThanOrderByCreatedAtDesc(
        userId,
        cursorTime,
        pageable
    );
  }

  @Override
  public void save(PostFeed postFeed) {
    repository.save(postFeed);
  }
}
