package com.threadly.config;

import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MinioConfig {

  private final MediaServerProperties mediaServerProperties;

  @Bean
  public MinioClient minioClient() {
    return MinioClient.builder()
        .endpoint(mediaServerProperties.endpoint())
        .credentials(mediaServerProperties.accessKey(), mediaServerProperties.secretKey())
        .build();
  }
}
