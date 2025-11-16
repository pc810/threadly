package com.threadly.media.application.listener;

import com.threadly.media.CreateMediaEvent;
import com.threadly.media.application.usecase.MediaInternalApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
public class MediaListener {

  private final MediaInternalApi mediaInternalApi;

  @EventListener
  public void handleAddMedia(CreateMediaEvent event) {
    log.info("creating image for {}", event);
    mediaInternalApi.createMedia(event);
    log.info("created image for {}", event);
  }
}
