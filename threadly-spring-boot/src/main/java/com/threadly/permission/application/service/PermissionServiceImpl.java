package com.threadly.permission.application.service;

import com.threadly.common.PermissionChecker;
import com.threadly.common.PermissionContext;
import com.threadly.common.PermissionKey;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class PermissionServiceImpl implements com.threadly.permission.PermissionService {

  private final List<PermissionChecker> checkers;

  @Override
  public boolean hasPermission(PermissionContext context) {

    var keys = context.permissionKeys();

    return keys.stream().allMatch(k -> hasPermission(context.actorId(), context.resourceId(), k));

  }

  @Override
  public boolean hasPermission(UUID actorId, UUID resourceId, PermissionKey permissionKey) {

    return checkers.stream().filter(c -> c.supports(permissionKey)).findFirst()
        .map(c -> c.hasPermission(actorId, resourceId, permissionKey)).orElse(false);
  }

}
