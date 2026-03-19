package com.threadly.vote.application.usecase;

import com.threadly.vote.VoteDTO;
import com.threadly.vote.VoteId;
import com.threadly.vote.VoteResult;
import java.util.Optional;

public interface VoteUseCase {

  VoteResult upVote(VoteId id);

  VoteResult downVote(VoteId id);

  Optional<VoteDTO> getVote(VoteId id);
}
