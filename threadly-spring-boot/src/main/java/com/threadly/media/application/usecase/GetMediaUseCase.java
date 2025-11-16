package com.threadly.media.application.usecase;

import com.threadly.media.domain.Media;
import java.util.Optional;
import java.util.UUID;

public interface GetMediaUseCase {

  Optional<Media> findById(UUID id);

}
