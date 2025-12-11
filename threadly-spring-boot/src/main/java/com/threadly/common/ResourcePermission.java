package com.threadly.common;

public class ResourcePermission {

  public enum Sys implements ResourcePermissionType {
    USER,
    AUTH,
    ADMIN;

    public String value() {
      return name().toLowerCase();
    }
  }

  public enum Community implements ResourcePermissionType {
    VIEW,
    UPDATE,
    DELETE,
    ADD_POST,
    FOLLOWER,
    OWNER_PRIVILEGE;

    public String value() {
      return name().toLowerCase();
    }
  }

  public enum Post implements ResourcePermissionType {
    VIEW,
    UPDATE,
    REMOVE;

    public String value() {
      return name().toLowerCase();
    }
  }
}

