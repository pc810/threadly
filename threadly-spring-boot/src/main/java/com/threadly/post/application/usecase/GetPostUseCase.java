package com.threadly.post.application.usecase;

import com.threadly.post.domain.Post;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GetPostUseCase {

  Optional<Post> getPost(UUID id);

  List<Post> getAllPosts();

  List<Post> getAllPosts(int page, int size);
}
