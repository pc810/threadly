package com.threadly.post.application.service;

import com.threadly.post.application.usecase.PostInternalApi;
import com.threadly.post.CreatePostRequest;
import com.threadly.post.PostCreatedEvent;
import com.threadly.post.domain.Post;
import com.threadly.post.infrastructure.persistence.PostRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
public class PostService implements PostInternalApi {

  private final PostRepository postRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  public UUID createPost(CreatePostRequest request, UUID userId) {

    var post = Post.from(request, userId);

    postRepository.save(post);

    eventPublisher.publishEvent(new PostCreatedEvent(
        post.getId(),
        post.getTitle(),
        post.getType()
    ));

    log.info("Post created title={} userId={}", post.getId(), userId);

    return post.getId();
  }

  @Override
  public Optional<Post> getPost(UUID id) {
    return postRepository.findById(id);
  }

  @Override
  public List<Post> getAllPosts() {
    return postRepository
        .findAll();
  }
}
