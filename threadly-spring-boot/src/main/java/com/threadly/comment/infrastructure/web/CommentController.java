package com.threadly.comment.infrastructure.web;

import com.threadly.comment.CreateCommentRequest;
import com.threadly.comment.application.usecase.CommentInternalApi;
import com.threadly.comment.domain.Comment;
import com.threadly.common.UserPrincipal;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CommentController {

  private final CommentInternalApi commentInternalApi;


  @PostMapping("/posts/{postId}/comment")
  @PreAuthorize("hasPermission(#postId, 'POST', 'CAN_ADD_COMMENT')")
  public ResponseEntity<Void> postComment(@PathVariable("postId") UUID postId,
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @RequestBody CreateCommentRequest createCommentRequest) {

    if (!createCommentRequest.actorId().equals(userPrincipal.getUserId())) {
      log.info("bad request actor and principal not same");
      return ResponseEntity.badRequest().build();
    }

    commentInternalApi.createComment(createCommentRequest, userPrincipal.getUserId());

    return ResponseEntity.ok().build();
  }

  @GetMapping("/posts/{postId}/comment")
  @PreAuthorize("hasPermission(#postId, 'POST', 'CAN_VIEW_COMMENT')")
  ResponseEntity<Slice<Comment>> getPostComment(
      @PathVariable UUID postId,
      @RequestParam(required = false) UUID parentId,
      @RequestParam(defaultValue = "0") int pageNumber
  ) {
    return ResponseEntity.ok(commentInternalApi.getPostComments(postId, parentId, pageNumber, 1));
  }
}
