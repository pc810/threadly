package com.threadly.post.infrastructure.web;

import com.threadly.auth.application.usecase.PostInternalApi;
import com.threadly.common.UserPrincipal;
import com.threadly.post.CreatePostRequest;
import com.threadly.post.domain.Post;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
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
    log.info("Creating post: title={}", request.title());

    var postId = postInternalApi.createPost(request, principal.userId());

    log.info("Created post with ID={}", postId);

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
}
