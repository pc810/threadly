package com.threadly.comment.infrastructure.web;

import com.threadly.comment.CreateCommentRequest;
import com.threadly.comment.application.usecase.CommentInternalApi;
import com.threadly.comment.domain.Comment;
import com.threadly.comment.domain.Vote;
import com.threadly.common.UserPrincipal;
import java.net.URI;
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

    var commentId = commentInternalApi.createComment(createCommentRequest,
        userPrincipal.getUserId());

    var location = URI.create("/comments/" + commentId);
    return ResponseEntity.created(location).build();
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

  @PostMapping("/comments/{commentId}/vote/{direction}")
  @PreAuthorize("hasPermission(#commentId, 'COMMENT', 'CAN_VOTE')")
  ResponseEntity<Void> vote(
      @PathVariable UUID commentId,
      @PathVariable String direction,
      @AuthenticationPrincipal UserPrincipal principal
  ) {
    if (direction.equals("up")) {
      commentInternalApi.upVote(commentId, principal.getUserId());
    } else if (direction.equals("down")) {
      commentInternalApi.downVote(commentId, principal.getUserId());
    }

    return ResponseEntity.ok().build();
  }


  @GetMapping("/comments/{commentId}/vote")
  @PreAuthorize("hasPermission(#commentId, 'COMMENT', 'CAN_VIEW')")
  ResponseEntity<Vote> vote(
      @PathVariable UUID commentId,
      @AuthenticationPrincipal UserPrincipal principal
  ) {

    return commentInternalApi
        .getVote(commentId, principal.userId())
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
