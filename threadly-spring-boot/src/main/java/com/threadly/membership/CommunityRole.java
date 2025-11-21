package com.threadly.membership;

import com.threadly.common.AuthRole;
import lombok.Getter;

@Getter
public enum CommunityRole {
  OWNER(AuthRole.AUTHOR),
  MOD(AuthRole.MOD),
  MEMBER(AuthRole.MEMBER),
  USER(AuthRole.USER),
  PUBLIC(AuthRole.USER);

  private final AuthRole authRole;

  CommunityRole(AuthRole authRole) {
    this.authRole = authRole;
  }

}
