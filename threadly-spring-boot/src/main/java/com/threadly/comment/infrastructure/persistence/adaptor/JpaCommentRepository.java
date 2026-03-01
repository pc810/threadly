package com.threadly.comment.infrastructure.persistence.adaptor;

import com.threadly.comment.domain.Comment;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCommentRepository extends JpaRepository<Comment, UUID>,
    PagingAndSortingRepository<Comment, UUID> {

  Slice<Comment> findByPostIdAndDepthOrderByCreatedAtDesc(
      UUID postId,
      UUID parentId,
      Pageable pageable);

  void deleteByPostId(UUID postId);
}
