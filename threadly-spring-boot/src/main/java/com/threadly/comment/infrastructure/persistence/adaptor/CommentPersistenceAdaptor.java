package com.threadly.comment.infrastructure.persistence.adaptor;

import com.threadly.comment.domain.Comment;
import com.threadly.comment.infrastructure.persistence.CommentRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
class CommentPersistenceAdaptor implements CommentRepository {

  private final JpaCommentRepository jpaCommentRepository;

  @Override
  public Optional<Comment> findById(UUID id) {
    return jpaCommentRepository.findById(id);
  }


  @Override
  public Slice<Comment> getComments(UUID postId, UUID parentId, PageRequest pageRequest) {
    return jpaCommentRepository.findByPostIdAndParentIdOrderByCreatedAtDesc(postId, parentId,
        pageRequest);
  }

  @Override
  public void save(Comment comment) {
    jpaCommentRepository.save(comment);
  }


  @Override
  public void deleteByPostId(UUID postId) {
    jpaCommentRepository.deleteByPostId(postId);
  }

  @Override
  public void deleteById(UUID id) {
    jpaCommentRepository.deleteById(id);
  }

  @Override
  public void incrementChildCountById(UUID id) {
    jpaCommentRepository.incrementChildCountById(id);
  }

  @Override
  public void incrementUpVote(UUID id, Integer delta) {
    jpaCommentRepository.incrementUpVote(id, delta);
  }

  @Override
  public void incrementDownVote(UUID id, Integer delta) {
    jpaCommentRepository.incrementDownVote(id, delta);
  }

}
