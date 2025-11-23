package com.threadly.common;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public abstract class PermissionChecker extends AbstractResourceSupport {

  public PermissionChecker(List<ResourceType> supportedResources) {
    super(supportedResources);
  }

  public abstract boolean hasPermission(UUID actorId, PermissionKey permissionKey,
      Optional<UUID> resourceId);

  public abstract Optional<AuthRole> resolve(UUID actorId);

  public abstract Optional<AuthRole> resolve(UUID resourceId, UUID actorId);

  public String getName() {
    return """
        PermissionChecker :: %s""".formatted(supportedResources.toString());
  }

}
