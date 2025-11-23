package com.threadly.permission.application.service;

import com.threadly.common.PermissionChecker;
import com.threadly.common.PermissionContext;
import com.threadly.common.PermissionKey;
import com.threadly.permission.PermissionService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
class PermissionServiceImpl implements PermissionService {

  private final List<PermissionChecker> checkers;

  @Override
  public boolean hasPermission(PermissionContext context) {

    var keys = context.permissionKeys();

    return keys.stream().allMatch(k -> hasPermission(context.actorId(), k, context.resourceId()));

  }

  @Override
  public boolean hasPermission(UUID actorId, PermissionKey permissionKey,
      Optional<UUID> resourceId) {

    return checkers.stream()
        .filter(c -> {
          boolean supports = c.supports(permissionKey);
          log.info("{}::supports {}", c.getName(), supports);
          return supports;
        })
        .allMatch(c -> {
          boolean hasPermission = c.hasPermission(actorId, permissionKey, resourceId);
          log.info("{} {}", c.getName(), hasPermission);
          return hasPermission;
        });

  }

}
