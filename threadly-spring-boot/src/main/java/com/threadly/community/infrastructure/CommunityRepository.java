package com.threadly.community.infrastructure;

import com.threadly.community.domain.Community;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommunityRepository {
  Optional<Community> findById(UUID id);

  List<Community> findAll();

  void save(Community community);

  Optional<Community> findByName(String name);
}
