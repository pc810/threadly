package com.threadly.comment.infrastructure.web;

import com.threadly.comment.CreateCommentRequest;
import com.threadly.comment.application.usecase.CommentInternalApi;
import com.threadly.comment.domain.Comment;
import com.threadly.common.UserPrincipal;
import com.threadly.vote.VoteDTO;
import com.threadly.vote.VoteExternalApi;
import com.threadly.vote.VoteId;
import com.threadly.vote.VoteResult;
import java.net.URI;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
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
  private final VoteExternalApi voteExternalApi;


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
    var voteId = VoteId.forComment(principal.getUserId(), commentId);

    VoteResult result;
    if ("up".equalsIgnoreCase(direction)) {
      result = voteExternalApi.upVote(voteId);
    } else if ("down".equalsIgnoreCase(direction)) {
      result = voteExternalApi.downVote(voteId);
    } else {
      return ResponseEntity.badRequest().build();
    }

    switch (result) {
      case NEW_UPVOTE -> commentInternalApi.incrementUpVote(commentId, 1);
      case NEW_DOWNVOTE -> commentInternalApi.incrementDownVote(commentId, 1);
      case UP_TO_DOWN -> {
        commentInternalApi.incrementUpVote(commentId, -1);
        commentInternalApi.incrementDownVote(commentId, 1);
      }
      case DOWN_TO_UP -> {
        commentInternalApi.incrementUpVote(commentId, 1);
        commentInternalApi.incrementDownVote(commentId, -1);
      }
      case NO_CHANGE -> { /* do nothing */ }
    }

    return ResponseEntity.ok().build();
  }


  @GetMapping("/comments/{commentId}/vote")
  @PreAuthorize("hasPermission(#commentId, 'COMMENT', 'CAN_VIEW')")
  ResponseEntity<VoteDTO> vote(
      @PathVariable UUID commentId,
      @AuthenticationPrincipal UserPrincipal principal
  ) {

    return voteExternalApi
        .getVote(VoteId.forComment(principal.userId(), commentId))
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
