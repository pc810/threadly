package com.threadly.post.infrastructure.web;

import com.threadly.common.UserPrincipal;
import com.threadly.post.CreatePostRequest;
import com.threadly.post.application.usecase.PostInternalApi;
import com.threadly.post.domain.Post;
import com.threadly.post.domain.PostLink;
import com.threadly.vote.VoteDTO;
import com.threadly.vote.VoteExternalApi;
import com.threadly.vote.VoteId;
import com.threadly.vote.VoteResult;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
@AllArgsConstructor
@Slf4j
public class PostController {

  private final PostInternalApi postInternalApi;
  private final VoteExternalApi voteExternalApi;

  @Operation(
      summary = "Create a new post",
      description = "Creates a new post authored by the currently authenticated user."
  )
  @PostMapping
  @PreAuthorize("hasPermission(#request.communityId, 'COMMUNITY', 'ADD_POST')")
  public ResponseEntity<Void> createPost(
      @Valid @RequestBody CreatePostRequest request,
      @AuthenticationPrincipal UserPrincipal principal
  ) {

    log.info("creating post: title={}, principal={}", request.title(), principal);

    var postId = postInternalApi.createPost(request, principal.userId());

    log.info("created post with ID={}", postId);

    var location = URI.create("/posts/" + postId);
    return ResponseEntity.created(location).build();
  }

  @Operation(
      summary = "Get post by ID",
      description = "Retrieves a post by its unique identifier."
  )
  @GetMapping("{id}")
  ResponseEntity<Post> getPost(@PathVariable UUID id) {
    return postInternalApi.getPost(id).map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }


  @Operation(
      summary = "Delete post by ID"
  )
  @DeleteMapping("{id}")
  @PreAuthorize("hasPermission(#id, 'POST', 'CAN_REMOVE')")
  ResponseEntity<Void> deletePost(@PathVariable UUID id,
      @AuthenticationPrincipal UserPrincipal principal) {

    return postInternalApi.deletePost(id, principal.getUserId())
        ? ResponseEntity.noContent().build()
        : ResponseEntity.notFound().build();
  }


  @Operation(
      summary = "Get all posts",
      description = "Retrieves a paginated list of all posts available in the system."
  )
  @GetMapping
  ResponseEntity<List<Post>> getAllPosts(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    List<Post> posts = postInternalApi.getAllPosts(page, size);
    return ResponseEntity.ok(posts);
  }

  @GetMapping("{id}/post-link")
  ResponseEntity<PostLink> getPostLinkById(@PathVariable("id") UUID postId) {
    return
        postInternalApi.findPostLinkByPostId(postId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
  }


  @GetMapping("communities/{communityId}")
  ResponseEntity<List<Post>> getAllPostsByCommunityName(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @PathVariable UUID communityId
  ) {
    List<Post> posts = postInternalApi.getAllPostsByCommunityId(page, size, communityId);
    return ResponseEntity.ok(posts);
  }

  @PostMapping("{id}/vote/{direction}")
  @PreAuthorize("hasPermission(#id, 'POST', 'CAN_VOTE')")
  ResponseEntity<Void> vote(
      @PathVariable UUID id,
      @PathVariable String direction,
      @AuthenticationPrincipal UserPrincipal principal
  ) {
    var voteId = VoteId.forPost(principal.getUserId(), id);

    VoteResult result;
    if ("up".equalsIgnoreCase(direction)) {
      result = voteExternalApi.upVote(voteId);
    } else if ("down".equalsIgnoreCase(direction)) {
      result = voteExternalApi.downVote(voteId);
    } else {
      return ResponseEntity.badRequest().build();
    }

    switch (result) {
      case NEW_UPVOTE -> postInternalApi.incrementUpVote(id, 1);
      case NEW_DOWNVOTE -> postInternalApi.incrementDownVote(id, 1);
      case UP_TO_DOWN -> {
        postInternalApi.incrementUpVote(id, -1);
        postInternalApi.incrementDownVote(id, 1);
      }
      case DOWN_TO_UP -> {
        postInternalApi.incrementUpVote(id, 1);
        postInternalApi.incrementDownVote(id, -1);
      }
      case NO_CHANGE -> { /* do nothing */ }
    }

    return ResponseEntity.ok().build();
  }


  @GetMapping("{id}/vote")
  @PreAuthorize("hasPermission(#commentId, 'COMMENT', 'CAN_VIEW')")
  ResponseEntity<VoteDTO> vote(
      @PathVariable UUID id,
      @AuthenticationPrincipal UserPrincipal principal
  ) {

    return voteExternalApi
        .getVote(VoteId.forPost(principal.userId(), id))
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

}
