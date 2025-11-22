package com.threadly.common;

import java.util.List;
import java.util.UUID;

public abstract class PermissionChecker {

  private final List<ResourceType> supportedResources;

  public abstract boolean hasPermission(UUID actorId, UUID resourceId, PermissionKey permissionKey);

  public PermissionChecker(List<ResourceType> supportedResources) {
    this.supportedResources = supportedResources;
  }

  public boolean supports(PermissionKey permissionKey) {
    return supportedResources.contains(permissionKey.resource());
  }
}
