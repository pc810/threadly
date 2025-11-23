package com.threadly.common;

import java.util.List;

public abstract class AbstractResourceSupport {

  protected final List<ResourceType> supportedResources;

  protected AbstractResourceSupport(List<ResourceType> supportedResources) {
    this.supportedResources = supportedResources;
  }

  public boolean supports(PermissionKey permissionKey) {
    return supportedResources.contains(permissionKey.resource());
  }
}
