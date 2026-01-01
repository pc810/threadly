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
    CAN_FOLLOW,
    CAN_UNFOLLOW,
    CAN_INVITE,
    CAN_UPDATE_INVITATION,
    FOLLOWER,
    OWNER_PRIVILEGE,
    MOD_PRIVILEGE;

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

