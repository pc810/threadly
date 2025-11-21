package com.threadly.post.application.service;

import com.threadly.community.CommunityExternalApi;
import com.threadly.media.CreateMediaEvent;
import com.threadly.media.MediaExternalApi;
import com.threadly.post.CreatePostRequest;
import com.threadly.post.PostCreatedEvent;
import com.threadly.post.PostType;
import com.threadly.post.application.usecase.PostInternalApi;
import com.threadly.post.domain.Post;
import com.threadly.post.domain.PostLink;
import com.threadly.post.domain.PostMetaUpdateEvent;
import com.threadly.post.infrastructure.persistence.PostLinkRepository;
import com.threadly.post.infrastructure.persistence.PostRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@AllArgsConstructor
@Service
public class PostService implements PostInternalApi {

  private final PostRepository postRepository;
  private final PostLinkRepository postLinkRepository;
  private final CommunityExternalApi communityExternalApi;
  private final MediaExternalApi mediaExternalApi;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  @Transactional
  public UUID createPost(CreatePostRequest request, UUID userId) {

    if (!communityExternalApi.canPostInCommunity(request.communityId(), userId)) {
      throw new AccessDeniedException(
          String.format("Cannot post in community user=%s community=%s", userId,
              request.communityId())
      );
    }

    var post = Post.from(request, userId);

    postRepository.save(post);

    eventPublisher.publishEvent(new PostCreatedEvent(
        post.getId(),
        post.getTitle(),
        post.getType(),
        post.getType().equals(PostType.LINK) ? Optional.of(post.getLink()) : Optional.empty()
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

  @Override
  public List<Post> getAllPosts(int page, int size) {
    return postRepository.findByPage(PageRequest
        .of(page, Math.min(size, 10), Sort.by("createdAt").descending()));
  }

  @Override
  @Transactional(readOnly = true)
  public List<Post> getAllPostsByCommunityId(int page, int size, UUID communityId) {
    log.info("fetching posts for community={}", communityId);
    return postRepository.findByPageAndCommunityId(communityId, PageRequest
        .of(page, Math.min(size, 10), Sort.by("createdAt").descending()));
  }

  @Override
  public Optional<PostLink> findPostLinkByPostId(UUID postId) {
    return postLinkRepository.findByPostId(postId);
  }

  @Override
  public void updatePostMeta(PostMetaUpdateEvent event) {
//    var post = postRepository.findById(event.postId())
//        .orElseThrow(() -> new PostNotFoundException(event.postId()));
//
//    if (!post.getType().equals(PostType.LINK)) {
//      throw new IllegalArgumentException("Mismatch postType");
//    }

    var mediaID = mediaExternalApi.createMedia(new CreateMediaEvent(
        event.postId(),
        event.seo().image().basePath(),
        event.seo().image().provider(),
        event.seo().image().filename(),
        event.seo().image().contentType(),
        event.seo().image().dimension()
    ));

    var postLink = postLinkRepository.findByPostId(event.postId());

    if (postLink.isEmpty()) {
      var newPostLink = PostLink.from(event);

      newPostLink.setMediaId(mediaID);

      postLinkRepository.save(newPostLink);

    } else {
      var existingPostLink = postLink.get();
      existingPostLink.updateFrom(event);
      postLinkRepository.save(existingPostLink);
    }
  }
}
