package com.threadly.vote.infrastructure.persistence.adaptor;


import com.threadly.vote.VoteId;
import com.threadly.vote.domain.Vote;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaVoteRepository extends JpaRepository<Vote, UUID> {

  Optional<Vote> findByUserIdAndPostIdAndCommentId(UUID uuid, UUID uuid1, UUID uuid2);
}
