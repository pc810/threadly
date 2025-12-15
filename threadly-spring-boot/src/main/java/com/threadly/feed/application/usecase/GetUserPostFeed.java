package com.threadly.feed.application.usecase;

import com.threadly.feed.domain.PostFeed;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

interface GetUserPostFeedUseCase {

  Slice<PostFeed> getUserPostFeed(UUID userId, Pageable pageable, Instant feedTime);
}


