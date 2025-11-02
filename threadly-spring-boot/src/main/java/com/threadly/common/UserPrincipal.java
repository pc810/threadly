package com.threadly.common;

import java.security.Principal;
import java.util.UUID;

public record UserPrincipal(UUID userId) implements Principal {

  @Override
  public String getName() {
    return userId.toString();
  }
}
