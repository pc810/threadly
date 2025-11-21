package com.threadly.common;

public @interface Auth {

  String resourceId();

  ResourceType resourceType();

  PermissionKey permission();
}

//@Auth(resourceType = ResourceType.COMMUNITY, resourceId = "communityName", permission = PermissionKey.COMMUNITY_VIEW)