package com.threadly.post.application.usecase;

import com.threadly.post.domain.PostLink;
import java.util.Optional;
import java.util.UUID;

public interface CreatePostLinkUseCase {

  Optional<PostLink> findPostLinkByPostId(UUID postId);
}
