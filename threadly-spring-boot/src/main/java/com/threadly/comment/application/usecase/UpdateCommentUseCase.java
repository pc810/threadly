package com.threadly.comment.application.usecase;

import java.util.UUID;

public interface UpdateCommentUseCase {

  void incrementChildCountById(UUID id);
}
