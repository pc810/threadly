package com.threadly.common;

import lombok.Getter;

@Getter
public enum PermissionKey {
  COMMUNITY_VIEW(ResourceType.COMMUNITY, PermissionAction.VIEW),
  COMMUNITY_ADD(ResourceType.COMMUNITY, PermissionAction.ADD),
  COMMUNITY_EDIT(ResourceType.COMMUNITY, PermissionAction.EDIT),
  COMMUNITY_DELETE(ResourceType.COMMUNITY, PermissionAction.DELETE),

  COMMUNITY_MEMBERSHIP_VIEW(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.VIEW),
  COMMUNITY_MEMBERSHIP_ADD(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.ADD),
  COMMUNITY_MEMBERSHIP_EDIT(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.EDIT),
  COMMUNITY_MEMBERSHIP_DELETE(ResourceType.COMMUNITY_MEMBERSHIP, PermissionAction.DELETE);

  private final ResourceType resource;
  private final PermissionAction action;

  PermissionKey(ResourceType resource, PermissionAction action) {
    this.resource = resource;
    this.action = action;
  }

  }
