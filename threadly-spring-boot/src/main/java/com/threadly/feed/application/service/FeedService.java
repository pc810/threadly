package com.threadly.feed.application.service;

import com.threadly.feed.application.usecase.PostFeedInternalApi;
import com.threadly.feed.domain.PostFeed;
import com.threadly.feed.infrastructure.PostFeedRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
class PostFeedService implements PostFeedInternalApi {

  private final PostFeedRepository postFeedRepository;

  @Override
  public Slice<PostFeed> getUserPostFeed(UUID userId, Pageable pageable, Instant feedTime) {
    return postFeedRepository.getPostFeed(userId, feedTime, pageable);
  }

  @Override
  public void createPostFeed(UUID communityId, UUID postId, UUID userId) {
    log.info("Creating post feed in communityId={} for postId={} userId={}", communityId, postId,
        userId);
    postFeedRepository.save(PostFeed.from(communityId, postId, userId));
  }

  @Override
  public void deletePostById(UUID postId) {
    postFeedRepository.deleteByPostId(postId);
  }
}
