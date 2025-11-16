package com.threadly.post.application.usecase;

import com.threadly.post.domain.PostMetaUpdateEvent;

public interface UpdatePostMetaUseCase {

  void updatePostMeta(PostMetaUpdateEvent event);
}
