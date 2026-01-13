package com.threadly.post;

import com.threadly.post.domain.Post;
import java.util.UUID;

public record PostDeletedEvent(UUID postId, UUID communityId, PostType type, UUID actor) {

  public static PostDeletedEvent from(Post post, UUID actor) {
    return new PostDeletedEvent(
        post.getId(),
        post.getCommunityId(),
        post.getType(),
        actor
    );
  }
}
