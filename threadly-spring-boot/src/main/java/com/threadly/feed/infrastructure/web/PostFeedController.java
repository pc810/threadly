package com.threadly.feed.infrastructure.web;

import com.threadly.feed.domain.PostFeed;
import com.threadly.feed.infrastructure.PostFeedRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("post-feed")
@RequiredArgsConstructor
class PostFeedController {

  private final PostFeedRepository postFeedRepository;

  @GetMapping("{userId}")
  public ResponseEntity<Slice<PostFeed>> getUserPostFeed(
      @PathVariable UUID userId,
      @RequestParam(required = false) Instant feedTime,
      @RequestParam(defaultValue = "0") int pageNumber
  ) {

    var feed = postFeedRepository.getPostFeed(
        userId,
        feedTime,
        PageRequest.of(
            pageNumber,
            1
        )
    );
    return ResponseEntity.ok(feed);
  }

}
