package com.threadly.common;


public class ResourceRelation {

  public enum Sys implements RelationType {
    REGULAR_USER,
    ADMIN_USER;

    public String value() {
      return name().toLowerCase();
    }
  }

  public enum Community implements RelationType {
    SYS,
    OWNER,
    MOD,
    MEMBER,
    PUBLIC_USER;

    public String value() {
      return name().toLowerCase();
    }
  }

  public enum Post implements RelationType {
    COMMUNITY,
    AUTHOR;

    public String value() {
      return name().toLowerCase();
    }
  }
}
