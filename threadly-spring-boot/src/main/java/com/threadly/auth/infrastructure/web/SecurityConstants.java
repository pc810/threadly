package com.threadly.auth.infrastructure.web;

import java.util.List;

public class SecurityConstants {

  public static final List<String> PUBLIC_ENDPOINTS = List.of(
      "/public/**",
      /* AUTH */
      "/oauth2/**",
      "/auth/login",
      "/auth/register",
      "/auth/logout",
      "/auth/refresh",

      /* API */
      "/communities/name/**",
      "/users/name/**",

      /* observability */

      "/webjars/**",
      "/actuator/**",

      /* swagger */
      "/v3/api-docs/**",
      "/swagger-ui/**",
      "/swagger-ui.html",
      "/swagger-resources/**"
  );
}