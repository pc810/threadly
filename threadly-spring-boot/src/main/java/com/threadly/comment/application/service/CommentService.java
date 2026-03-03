package com.threadly.comment.application.service;

import com.threadly.comment.CreateCommentRequest;
import com.threadly.comment.application.usecase.CommentInternalApi;
import com.threadly.comment.domain.Comment;
import com.threadly.comment.infrastructure.persistence.CommentRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService implements CommentInternalApi {

  private final CommentRepository commentRepository;

  @Transactional
  @Override
  public UUID createComment(CreateCommentRequest createCommentRequest, UUID actorId) {
    log.info("Creating comment for actorId={} for post={}", actorId, createCommentRequest.postId());

    var comment = Comment.from(createCommentRequest);

    commentRepository.save(comment);

    UUID parentId = comment.getParentId();

    while (parentId != null) {
      var parent = commentRepository.findById(parentId)
          .orElse(null);

      if (parent == null) {
        break;
      }

      log.info("Parent comment for parentId={} updating child count", parentId);

      commentRepository.incrementChildCountById(parent.getId());

      parentId = parent.getParentId();
    }


    log.info("Comment={} created for postId={} by userId={}", comment.getId(), comment.getPostId(),
        comment.getUserId());

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
}
