package com.threadly.membership;

import com.threadly.common.AuthRole;
import lombok.Getter;

@Getter
public enum CommunityRole {
  AUTHOR(AuthRole.AUTHOR),
  MOD(AuthRole.MOD),
  MEMBER(AuthRole.MEMBER),
  USER(AuthRole.USER),
  PUBLIC(AuthRole.PUBLIC);

  private final AuthRole authRole;

  CommunityRole(AuthRole authRole) {
    this.authRole = authRole;
  }

  public boolean isAuthor() {
    return this == AUTHOR;
  }

  public boolean isMod() {
    return this == MOD;
  }
}
