package com.threadly.common;

public enum PermissionKey {

  COMMUNITY_VIEW,
  COMMUNITY_ADD,
  COMMUNITY_EDIT,
  COMMUNITY_DELETE,

  COMMUNITY_MEMBERSHIP_VIEW,
  COMMUNITY_MEMBERSHIP_ADD,
  COMMUNITY_MEMBERSHIP_EDIT,
  COMMUNITY_MEMBERSHIP_DELETE,

  POST_VIEW,
  POST_EDIT,
  POST_DELETE;

  public static PermissionKey of(ResourceType resource, PermissionAction action) {
    return PermissionKey.valueOf(resource.name() + "_" + action.name());
  }
}
