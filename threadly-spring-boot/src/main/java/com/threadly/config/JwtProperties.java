package com.threadly.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "threadly.security.jwt")
public record JwtProperties(
    @NotBlank String secret,
    @DefaultValue("86400000") long accessMs, // 15min
    @DefaultValue("1209600000") long refreshMs // 14 days
) {

}
