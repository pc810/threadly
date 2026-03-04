package com.threadly.comment.domain;

import jakarta.persistence.Embeddable;
import java.util.UUID;

@Embeddable
public record VoteId(
    UUID commentId,
    UUID userId
) {

  public static VoteId from(UUID commentId, UUID userId) {
    return new VoteId(commentId, userId);
  }
}
