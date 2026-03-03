package com.threadly.comment.infrastructure.persistence;

import com.threadly.comment.domain.Comment;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface CommentRepository {

  Optional<Comment> findById(UUID id);

  Slice<Comment> getComments(UUID postId, UUID parentId, PageRequest pageRequest);

  void save(Comment comment);

  void deleteByPostId(UUID postId);

  void deleteById(UUID id);

  void incrementChildCountById(UUID id);
}
