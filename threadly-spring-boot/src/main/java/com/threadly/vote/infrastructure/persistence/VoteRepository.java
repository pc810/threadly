package com.threadly.vote.infrastructure.persistence;

import com.threadly.vote.VoteId;
import com.threadly.vote.domain.Vote;
import java.util.Optional;

public interface VoteRepository {

  Optional<Vote> findById(VoteId id);

  void save(Vote vote);
}
