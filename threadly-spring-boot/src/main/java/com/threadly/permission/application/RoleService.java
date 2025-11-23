package com.threadly.permission.application;

import com.threadly.common.AuthRole;
import com.threadly.common.PermissionKey;
import java.util.List;
import java.util.UUID;

public interface RoleService {

  List<AuthRole> getRoles(UUID actorId, PermissionKey permissionKey);

  List<AuthRole> getRoles(UUID actorId);
}
