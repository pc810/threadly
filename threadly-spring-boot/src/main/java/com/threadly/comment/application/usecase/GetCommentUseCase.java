package com.threadly.comment.application.usecase;

import com.threadly.comment.domain.Comment;
import java.util.UUID;
import org.springframework.data.domain.Slice;

public interface GetCommentUseCase {

  Slice<Comment> getPostComments(UUID postId, UUID parentId, Integer page, Integer size);
}
