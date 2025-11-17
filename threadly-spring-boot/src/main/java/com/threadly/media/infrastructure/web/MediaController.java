package com.threadly.media.infrastructure.web;

import com.threadly.media.ImageMedia;
import com.threadly.media.application.usecase.MediaInternalApi;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("medias")
@RequiredArgsConstructor
public class MediaController {

  private final MediaInternalApi mediaInternalApi;

  @GetMapping("{id}")
  ResponseEntity<ImageMedia> getMediaById(@PathVariable("id") UUID id) {
    return mediaInternalApi.findImageMediaById(id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
