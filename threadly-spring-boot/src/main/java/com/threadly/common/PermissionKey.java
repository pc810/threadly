package com.threadly.common;

public enum PermissionKey {

  COMMUNITY_VIEW(ResourceType.COMMUNITY, PermissionAction.VIEW),
  COMMUNITY_ADD(ResourceType.COMMUNITY, PermissionAction.ADD),
  COMMUNITY_EDIT(ResourceType.COMMUNITY, PermissionAction.EDIT),
  COMMUNITY_DELETE(ResourceType.COMMUNITY, PermissionAction.DELETE),

  COMMUNITY_MEMBERSHIP_VIEW(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.VIEW),
  COMMUNITY_MEMBERSHIP_ADD(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.ADD),
  COMMUNITY_MEMBERSHIP_EDIT(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.EDIT),
  COMMUNITY_MEMBERSHIP_DELETE(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.DELETE),


  POST_VIEW(ResourceType.POST, PermissionAction.VIEW),
  POST_EDIT(ResourceType.POST, PermissionAction.EDIT),
  POST_DELETE(ResourceType.POST, PermissionAction.DELETE);

  private final ResourceType resource;
  private final PermissionAction action;

  PermissionKey(ResourceType resource, PermissionAction action) {
    this.resource = resource;
    this.action = action;
  }

  public static PermissionKey of(ResourceType resource, PermissionAction action) {
    return PermissionKey.valueOf(resource.name() + "_" + action.name());
  }

  public ResourceType resource() {
    return resource;
  }

  public PermissionAction action() {
    return action;
  }
}
