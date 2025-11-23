package com.threadly.permission.application.service;


import com.threadly.common.AuthRole;
import com.threadly.common.PermissionKey;
import com.threadly.permission.application.RoleService;
import java.util.List;
import java.util.UUID;

public class RoleServiceImpl implements RoleService {

  @Override
  public List<AuthRole> getRoles(UUID actorId, PermissionKey permissionKey) {
    return List.of();
  }

  @Override
  public List<AuthRole> getRoles(UUID actorId) {
    return List.of();
  }
}
