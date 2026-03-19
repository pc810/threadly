package com.threadly.vote.infrastructure.persistence.adaptor;

import com.threadly.vote.VoteId;
import com.threadly.vote.domain.Vote;
import com.threadly.vote.infrastructure.persistence.VoteRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VotePersistenceAdaptor implements VoteRepository {

  private final JpaVoteRepository jpaVoteRepository;

  @Override
  public Optional<Vote> findById(VoteId id) {
    return jpaVoteRepository.findByUserIdAndPostIdAndCommentId(id.userId(), id.postId(),
        id.commentId());
  }

  @Override
  public void save(Vote vote) {
    jpaVoteRepository.save(vote);
  }
}
