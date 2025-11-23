package com.threadly.permission;

import com.threadly.common.PermissionContext;
import com.threadly.common.PermissionKey;
import java.util.Optional;
import java.util.UUID;

public interface PermissionService {

  boolean hasPermission(PermissionContext context);

  boolean hasPermission(UUID actorId, PermissionKey permissionKey, Optional<UUID> resourceId);

}
