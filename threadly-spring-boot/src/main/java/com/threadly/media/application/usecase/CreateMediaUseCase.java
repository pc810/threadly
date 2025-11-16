package com.threadly.media.application.usecase;

import com.threadly.media.CreateMediaEvent;
import java.util.UUID;

public interface CreateMediaUseCase {
  UUID createMedia(CreateMediaEvent event);
}
