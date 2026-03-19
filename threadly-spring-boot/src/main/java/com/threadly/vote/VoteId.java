package com.threadly.vote;

import jakarta.persistence.Embeddable;
import java.util.UUID;

@Embeddable
public record VoteId(
    UUID userId,
    UUID commentId,
    UUID postId
) {

  public static VoteId forComment(UUID userId, UUID commentId) {
    return new VoteId(
        userId,
        commentId,
        null
    );
  }

  public static VoteId forPost(UUID userId, UUID postId) {
    return new VoteId(
        userId,
        null,
        postId
    );
  }

  public boolean isForComment() {
    return commentId != null;
  }

  public boolean isForPost() {
    return postId != null;
  }
}
