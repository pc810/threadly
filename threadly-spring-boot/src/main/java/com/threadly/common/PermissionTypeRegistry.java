package com.threadly.common;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PermissionTypeRegistry {

  private static final Map<String, ResourcePermissionType> PERMISSIONS = new HashMap<>();

  static {
    register(ResourcePermission.Sys.values());
    register(ResourcePermission.Community.values());
    register(ResourcePermission.Post.values());
    register(ResourcePermission.Comment.values());
  }

  private static void register(ResourcePermissionType[] values) {
    for (ResourcePermissionType rt : values) {
      PERMISSIONS.put(rt.value(), rt);
    }
  }

  public static ResourcePermissionType fromString(String input) {
    if (input == null) {
      return null;
    }
    log.info("input={} values={}",input,PERMISSIONS);
    return PERMISSIONS.get(input.toLowerCase());
  }
}
