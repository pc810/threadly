package com.threadly.comment.application.usecase;

import com.threadly.comment.domain.Vote;
import java.util.Optional;
import java.util.UUID;

public interface CommentVoteUseCase {

  void upVote(UUID id, UUID userId);

  void downVote(UUID id, UUID userId);

  Optional<Vote> getVote(UUID commentId, UUID userId);
}
