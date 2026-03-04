package com.threadly.comment.infrastructure.persistence.adaptor;

import com.threadly.comment.domain.Vote;
import com.threadly.comment.domain.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaVoteRepository extends JpaRepository<Vote, VoteId> {

}
