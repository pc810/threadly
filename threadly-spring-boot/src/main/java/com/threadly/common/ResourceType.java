package com.threadly.common;

public enum ResourceType {
  COMMUNITY,
  USER,
  SYS,
  POST,
  COMMENT;

  public String value() {
    return name().toLowerCase();
  }

}
