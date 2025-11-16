package com.threadly.post.domain;

import java.util.UUID;

public record PostMetaUpdateEvent(
  UUID id,
  UUID postId,
  PostSEO seo
) {

}
