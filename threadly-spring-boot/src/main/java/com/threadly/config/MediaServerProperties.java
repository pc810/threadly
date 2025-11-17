package com.threadly.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "threadly.media-server")
public record MediaServerProperties(
    @NotBlank String endpoint,
    @NotBlank String accessKey,
    @NotBlank String secretKey
) {

}
