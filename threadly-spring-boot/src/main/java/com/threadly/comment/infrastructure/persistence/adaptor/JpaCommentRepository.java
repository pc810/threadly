package com.threadly.comment.infrastructure.persistence.adaptor;

import com.threadly.comment.domain.Comment;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCommentRepository extends JpaRepository<Comment, UUID>,
    PagingAndSortingRepository<Comment, UUID> {

  Slice<Comment> findByPostIdAndParentIdOrderByCreatedAtDesc(
      UUID postId,
      UUID parentId,
      Pageable pageable);

  void deleteByPostId(UUID postId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("""
      UPDATE Comment c
      SET c.childCount = c.childCount + 1
      WHERE c.id = :id
      """)
  void incrementChildCountById(UUID id);


  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("""
      UPDATE Comment c SET c.upVote = c.upVote + :delta WHERE c.id = :id
      """)
  void incrementUpVote(UUID id, int delta);
  
  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("""
      UPDATE Comment c SET c.downVote = c.downVote + :delta WHERE c.id = :id
      """)
  void incrementDownVote(UUID id, int delta);

}
