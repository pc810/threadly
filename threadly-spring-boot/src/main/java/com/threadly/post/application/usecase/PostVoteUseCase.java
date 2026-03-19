package com.threadly.post.application.usecase;

import java.util.UUID;

public interface PostVoteUseCase {

  void incrementUpVote(UUID id, Integer delta);

  void incrementDownVote(UUID id, Integer delta);
}
