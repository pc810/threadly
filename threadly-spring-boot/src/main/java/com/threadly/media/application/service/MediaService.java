package com.threadly.media.application.service;

import com.threadly.media.CreateMediaEvent;
import com.threadly.media.ImageMedia;
import com.threadly.media.MediaExternalApi;
import com.threadly.media.application.usecase.IStorage;
import com.threadly.media.application.usecase.MediaInternalApi;
import com.threadly.media.domain.Media;
import com.threadly.media.infrastructure.persistence.MediaRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
class MediaService implements MediaInternalApi, MediaExternalApi {

  private final MediaRepository repository;
  private final IStorage storageService;

  @Override
  public UUID createMedia(CreateMediaEvent event) {

    var media = Media.from(event);

    repository.save(media);

    log.info("Media created id={} postId={}", media.getId(), media.getPostId());

    return media.getId();
  }

  @Override
  public Optional<Media> findById(UUID id) {
    return repository.findById(id);
  }

  @Override
  public Optional<ImageMedia> findImageMediaById(UUID id) {
    return findById(id).map(storageService::getImage);
  }
}
