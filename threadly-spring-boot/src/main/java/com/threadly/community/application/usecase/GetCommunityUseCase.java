package com.threadly.community.application.usecase;

import com.threadly.community.domain.Community;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GetCommunityUseCase {
  Optional<Community> getCommunity(UUID id);

  Optional<Community> getCommunityByName(String name);

  List<Community> getAllCommunity();

  List<Community> getAllCommunityByUser(UUID userId);
}
