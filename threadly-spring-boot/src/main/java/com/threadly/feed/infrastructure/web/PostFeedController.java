package com.threadly.feed.infrastructure.web;

import com.threadly.common.PostFeedDTO;
import com.threadly.common.UserPrincipal;
import com.threadly.feed.domain.PostFeed;
import com.threadly.feed.infrastructure.PostFeedRepository;
import com.threadly.post.PostExternalApi;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("post-feed")
@RequiredArgsConstructor
class PostFeedController {

  static int PAGE_SIZE = 1;

  private final PostFeedRepository postFeedRepository;
  private final PostExternalApi postExternalApi;

  @GetMapping("me")
  public ResponseEntity<Slice<PostFeedDTO>> getUserPostFeed(
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @RequestParam(required = false) Instant feedTime,
      @RequestParam(defaultValue = "0") int pageNumber
  ) {

    var feed = postFeedRepository.getPostFeed(
        userPrincipal.userId(),
        feedTime == null ? Instant.now() : feedTime,
        PageRequest.of(
            pageNumber,
            PAGE_SIZE
        )
    );

    return ResponseEntity.ok(feed.map(PostFeed::toDTO));
  }

  @GetMapping("communities/{communityId}")
  ResponseEntity<Slice<PostFeedDTO>> getCommunityPostsAsFeed(
      @RequestParam(defaultValue = "0") int pageNumber,
      @PathVariable UUID communityId
  ) {

    return ResponseEntity.ok(
        postExternalApi.getPostsByCommunityId(communityId, pageNumber, PAGE_SIZE));
  }
}
