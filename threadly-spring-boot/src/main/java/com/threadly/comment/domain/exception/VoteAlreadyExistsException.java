package com.threadly.comment.domain.exception;

import com.threadly.comment.domain.VoteId;

public class VoteAlreadyExistsException extends RuntimeException {

  public VoteAlreadyExistsException(String message) {
    super(message);
  }

  public static VoteAlreadyExistsException from(VoteId id) {
    return new VoteAlreadyExistsException(
        "vote already exists for comment " + id.commentId() + " user = " + id.userId());
  }
}