package com.threadly.media.infrastructure.persistence.adaptor;

import com.threadly.media.domain.Media;
import com.threadly.media.infrastructure.persistence.MediaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Slf4j
class MediaPersistenceRepositoryAdaptor implements MediaRepository {

  private final JpaMediaRepository repository;

  @Override
  public Optional<Media> findById(UUID id) {
    return repository.findById(id);
  }

  @Override
  public List<Media> findByPostId(UUID postId) {
    return repository.findByPostId(postId);
  }

  @Override
  public void save(Media media) {
    repository.save(media);
  }
}
