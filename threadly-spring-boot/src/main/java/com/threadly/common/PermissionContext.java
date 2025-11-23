package com.threadly.common;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public record PermissionContext(
    UserPrincipal principal,
    List<PermissionKey> permissionKeys,
    Optional<UUID> resourceId
) {

  public UUID actorId() {
    return principal == null ? null : principal.getUserId();
  }
}
