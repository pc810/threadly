package com.threadly.comment.domain.exception;

import com.threadly.comment.domain.VoteId;

public class VoteNotFoundException extends RuntimeException {

  public VoteNotFoundException(String message) {
    super(message);
  }

  public static VoteNotFoundException voteNotFoundException(VoteId id) {
    return new VoteNotFoundException("vote not found for comment " + id.commentId());
  }
}
