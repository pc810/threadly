package com.threadly.vote.domain.exception;


import com.threadly.vote.VoteId;

public class VoteAlreadyExistsException extends RuntimeException {

  public VoteAlreadyExistsException(String message) {
    super(message);
  }

  public static VoteAlreadyExistsException from(VoteId id) {
    if (id.isForComment()) {
      return new VoteAlreadyExistsException(
          "vote already exists for comment " + id.commentId() + " user = " + id.userId());
    }
    return new VoteAlreadyExistsException(
        "vote already exists for post " + id.postId() + " user = " + id.userId());
  }
}