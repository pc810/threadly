package com.threadly.vote.domain.exception;

public class VoteNotFoundException extends RuntimeException {

  public VoteNotFoundException(String message) {
    super(message);
  }

  public static VoteNotFoundException voteNotFoundException(com.threadly.vote.VoteId id) {
    if (id.isForComment()) {
      return new VoteNotFoundException("vote not found for comment " + id.commentId());
    }

    return new VoteNotFoundException("vote not found for post " + id.postId());
  }
}
