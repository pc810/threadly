package com.threadly.comment.application.usecase;

import com.threadly.comment.CreateCommentRequest;
import java.util.UUID;

public interface CreateCommentUseCase {
  UUID createComment(CreateCommentRequest comment, UUID actorId);
}
