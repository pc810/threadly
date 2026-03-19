package com.threadly.post.infrastructure.persistence.adaptor;

import com.threadly.post.domain.Post;
import com.threadly.post.domain.PostSummary;
import com.threadly.post.infrastructure.persistence.PostRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
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
  public Slice<PostSummary> findBySliceAndCommunityId(UUID communityId, PageRequest pageRequest) {
    return repository.findByCommunityIdOrderByCreatedAtDesc(communityId, pageRequest);
  }

  @Override
  public Slice<PostSummary> findBySliceAndUserId(UUID userId, PageRequest pageRequest) {
    return repository.findByUserIdOrderByCreatedAtDesc(userId, pageRequest);
  }

  @Override
  public void incrementUpVote(UUID id, Integer delta) {
    repository.incrementUpVote(id, delta);
  }

  @Override
  public void incrementDownVote(UUID id, Integer delta) {
    repository.incrementDownVote(id, delta);
  }

  @Override
  public List<Post> findByPageAndCommunityId(UUID communityId, PageRequest pageRequest) {
    return repository.findByCommunityId(communityId, pageRequest).get().toList();
  }

  @Override
  public void save(Post post) {
    repository.save(post);
  }

  @Override
  public void deleteById(UUID id) {
    repository.deleteById(id);
  }

}
