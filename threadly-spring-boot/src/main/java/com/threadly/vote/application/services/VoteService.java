package com.threadly.vote.application.services;

import com.threadly.vote.VoteDTO;
import com.threadly.vote.VoteExternalApi;
import com.threadly.vote.VoteId;
import com.threadly.vote.VoteResult;
import com.threadly.vote.domain.Vote;
import com.threadly.vote.infrastructure.persistence.VoteRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
class VoteService implements VoteExternalApi {

  private final VoteRepository voteRepository;

  @Transactional
  @Override
  public VoteResult upVote(VoteId id) {
    return vote(id, 1);
  }

  @Transactional
  @Override
  public VoteResult downVote(VoteId id) {
    return vote(id, -1);
  }

  @Override
  public Optional<VoteDTO> getVote(VoteId id) {
    return voteRepository.findById(id).map(Vote::toDTO);
  }

  private VoteResult vote(VoteId id, Integer direction) {

    var existingVote = voteRepository.findById(id);

    if (existingVote.isEmpty()) {
      voteRepository.save(Vote.from(id, direction));
      return direction == 1
          ? VoteResult.NEW_UPVOTE
          : VoteResult.NEW_DOWNVOTE;
    }

    var vote = existingVote.get();
    int oldDirection = vote.getDirection();

    if (oldDirection == direction) {
      return VoteResult.NO_CHANGE;
    }

    vote.setDirection(direction);
    voteRepository.save(vote);

    if (oldDirection == 1 && direction == -1) {
      return VoteResult.UP_TO_DOWN;
    }

    if (oldDirection == -1 && direction == 1) {
      return VoteResult.DOWN_TO_UP;
    }

    return VoteResult.NO_CHANGE;
  }
}