package com.threadly.media.infrastructure.persistence;

import com.threadly.media.domain.Media;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MediaRepository {

  Optional<Media> findById(UUID id);

  List<Media> findByPostId(UUID postId);

  void save(Media media);
}
