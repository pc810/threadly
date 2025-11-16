package com.threadly.post.infrastructure.web;

import com.threadly.common.UserPrincipal;
import com.threadly.post.CreatePostRequest;
import com.threadly.post.application.usecase.PostInternalApi;
import com.threadly.post.domain.Post;
import com.threadly.post.domain.PostLink;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

  @Operation(
      summary = "Create a new post",
      description = """
          Creates a new post authored by the currently authenticated user.
          The request body must include the post title, type, and content fields 
          (`contentJson`, `contentHtml`, and `contentText`), which represent the 
          editor data in multiple formats. 
          
          Returns the unique identifier of the newly created post.
          Authentication is required.
          """
  )
  @PostMapping
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
      description = """
          Retrieves a post by its unique identifier.
          Returns detailed information about the post, including its title,
          content in multiple formats (JSON, HTML, text), author information,
          and timestamps. 
          
          Accessible to all users; however, certain post types or drafts 
          may be restricted to the author or admins.
          """
  )
  @GetMapping("{id}")
  ResponseEntity<Post> getPost(@RequestParam UUID id) {
    return postInternalApi.getPost(id).map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }


  @Operation(
      summary = "Get all posts",
      description = """
          Retrieves a paginated list of all posts available in the system.
          Each post includes essential information such as its ID, title,
          type, author, and timestamps. For text-based posts, content fields 
          (JSON, HTML, text) are also included.
          
          This endpoint is publicly accessible, but may exclude certain 
          restricted or draft posts depending on visibility settings.
          
          Pagination parameters (page, size) and optional filters (e.g. 
          post type, user ID, or community ID) can be added in future 
          enhancements for efficient querying.
          """
  )
  @GetMapping
  ResponseEntity<List<Post>> getAllPosts() {
    List<Post> posts = postInternalApi.getAllPosts();
    return ResponseEntity.ok(posts);
  }


  @GetMapping("{id}/post-link")
  ResponseEntity<PostLink> getPostLinkById(@PathVariable("id") UUID postId) {
    return
        postInternalApi.findPostLinkByPostId(postId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
  }

}
