package com.threadly.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class OpenApiConfig {

//  @Bean
  public GroupedOpenApi userApi() {
    return GroupedOpenApi.builder()
        .group("user-service")
        .packagesToScan("com.threadly.user")
        .build();
  }
}