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
    CAN_VIEW,
    CAN_UPDATE,
    CAN_REMOVE,
    CAN_ADD_COMMENT,
    CAN_VIEW_COMMENT;

    public String value() {
      return name().toLowerCase();
    }
  }

  public enum Comment implements ResourcePermissionType {
    CAN_VIEW,
    CAN_VOTE;

    public String value() {
      return name().toLowerCase();
    }
  }
}

