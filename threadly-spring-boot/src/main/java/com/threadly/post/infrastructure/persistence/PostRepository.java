package com.threadly.post.infrastructure.persistence;

import com.threadly.post.domain.Post;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;

public interface PostRepository {

  Optional<Post> findById(UUID id);

  List<Post> findAll();

  List<Post> findByPage(PageRequest pageRequest);

  void save(Post post);

}
