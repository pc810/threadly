package com.threadly.common;

public enum ResourceType {
  COMMUNITY,
  USER,
  SYS,
  POST;

  public String value() {
    return name().toLowerCase();
  }

}
