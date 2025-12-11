package com.threadly.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "threadly.spicedb")
public record SpiceDBProperties(
    @NotBlank String host,
    @NotBlank String token
) {

}
