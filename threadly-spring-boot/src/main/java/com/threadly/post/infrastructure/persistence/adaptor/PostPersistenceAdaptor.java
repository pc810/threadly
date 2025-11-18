package com.threadly.post.infrastructure.persistence.adaptor;

import com.threadly.post.domain.Post;
import com.threadly.post.infrastructure.persistence.PostRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.converters.models.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Slf4j
public class PostPersistenceAdaptor implements PostRepository {

  private final JpaPostRepository repository;

  @Override
  public Optional<Post> findById(UUID id) {
    return repository.findById(id);
  }

  @Override
  public List<Post> findAll() {
    return repository.findAll();
  }

  @Override
  public List<Post> findByPage(PageRequest pageRequest) {
    return repository.findAll(pageRequest)
        .get().toList();
  }

  @Override
  public void save(Post post) {
    repository.save(post);
  }
}
