package com.threadly.comment.application.service;

import com.threadly.comment.CommentCreatedEvent;
import com.threadly.comment.CreateCommentRequest;
import com.threadly.comment.application.usecase.CommentInternalApi;
import com.threadly.comment.domain.Comment;
import com.threadly.comment.domain.Vote;
import com.threadly.comment.domain.VoteId;
import com.threadly.comment.domain.exception.VoteAlreadyExistsException;
import com.threadly.comment.infrastructure.persistence.CommentRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
class CommentService implements CommentInternalApi {

  private final CommentRepository commentRepository;

  private final ApplicationEventPublisher eventPublisher;

  @Transactional
  @Override
  public UUID createComment(CreateCommentRequest createCommentRequest, UUID actorId) {
    log.info("Creating comment for actorId={} for post={}", actorId, createCommentRequest.postId());

    var comment = Comment.from(createCommentRequest);

    commentRepository.save(comment);

    UUID parentId = comment.getParentId();

    while (parentId != null) {
      var parent = commentRepository.findById(parentId).orElse(null);

      if (parent == null) {
        break;
      }

      log.info("Parent comment for parentId={} updating child count", parentId);

      commentRepository.incrementChildCountById(parent.getId());

      parentId = parent.getParentId();
    }

    log.info("Comment={} created for postId={} by userId={}", comment.getId(), comment.getPostId(),
        comment.getUserId());

    eventPublisher.publishEvent(
        new CommentCreatedEvent(comment.getId(), comment.getCommunityId(), comment.getPostId()));

    return comment.getId();
  }

  @Override
  public Slice<Comment> getPostComments(UUID postId, UUID parentId, Integer page, Integer size) {
    return commentRepository.getComments(postId, parentId, PageRequest.of(page, size));
  }

  @Override
  public void incrementChildCountById(UUID id) {
    commentRepository.incrementChildCountById(id);
  }

  @Override
  public void upVote(UUID id, UUID userId) {
    vote(id, userId, 1);
  }

  @Override
  public void downVote(UUID id, UUID userId) {
    vote(id, userId, -1);
  }

  private void vote(UUID commentId, UUID userId, Integer direction) {
    var voteId = VoteId.from(commentId, userId);

    var vote = commentRepository.findVoteById(voteId);

    if (vote.isPresent()) {
      throw VoteAlreadyExistsException.from(voteId);
    } else {
      commentRepository.save(Vote.from(commentId, userId, direction));
    }
  }

  @Override
  public Optional<Vote> getVote(UUID commentId, UUID userId) {
    return commentRepository.findVoteById(VoteId.from(commentId, userId));
  }
}
