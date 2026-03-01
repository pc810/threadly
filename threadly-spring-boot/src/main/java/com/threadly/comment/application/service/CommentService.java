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

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService implements CommentInternalApi {

  private final CommentRepository commentRepository;

  @Override
  public UUID createComment(CreateCommentRequest createCommentRequest, UUID actorId) {
    log.info("Creating comment for actorId={} for post={}", actorId, createCommentRequest.postId());

    var comment = Comment.from(createCommentRequest);

    commentRepository.save(comment);

    log.info("Comment={} created for postId={} by userId={}", comment.getId(), comment.getPostId(),
        comment.getUserId());

    return comment.getId();
  }

  @Override
  public Slice<Comment> getPostComments(UUID postId, UUID parentId, Integer page, Integer size) {
    return commentRepository.getComments(postId, parentId, PageRequest.of(page, size));
  }
}
