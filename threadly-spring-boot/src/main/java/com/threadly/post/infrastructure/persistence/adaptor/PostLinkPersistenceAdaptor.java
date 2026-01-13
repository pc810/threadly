package com.threadly.post.infrastructure.persistence.adaptor;

import com.threadly.post.domain.PostLink;
import com.threadly.post.infrastructure.persistence.PostLinkRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Slf4j
public class PostLinkPersistenceAdaptor implements PostLinkRepository {

  private final JpaPostLinkRepository repository;

  @Override
  public Optional<PostLink> findById(UUID id) {
    return repository.findById(id);
  }

  @Override
  public Optional<PostLink> findByPostId(UUID postId) {
    return repository.findByPostId(postId);
  }

  @Override
  public void save(PostLink postLink) {
    repository.save(postLink);
  }

  @Override
  public void deleteByPostId(UUID postId) {
    repository.deleteByPostId(postId);
  }

  @Override
  public void deleteById(UUID id) {
    repository.deleteById(id);
  }
}
