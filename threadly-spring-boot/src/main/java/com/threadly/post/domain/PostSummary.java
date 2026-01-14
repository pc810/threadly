package com.threadly.post.domain;

import com.threadly.common.PostFeedDTO;
import com.threadly.post.PostType;
import java.time.Instant;
import java.util.UUID;

public interface PostSummary {
  UUID getId();
  UUID getUserId();
  UUID getCommunityId();
  PostType getType();
  Instant getCreatedAt();
}
