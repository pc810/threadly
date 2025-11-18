package com.threadly.community.infrastructure.adaptor;

import com.threadly.community.domain.Community;
import com.threadly.community.infrastructure.CommunityRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CommunityPersistenceAdaptor implements CommunityRepository {
  private final JpaCommunityRepository repository;

  @Override
  public Optional<Community> findById(UUID id) {
    return repository.findById(id);
  }

  @Override
  public List<Community> findAll() {
    return repository.findAll();
  }

  @Override
  public void save(Community community) {
      repository.save(community);
  }

  @Override
  public Optional<Community> findByName(String name) {
    return repository.findByName(name);
  }
}
