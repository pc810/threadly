package com.threadly.permission.internal;

import com.threadly.common.PermissionTypeRegistry;
import com.threadly.common.ResourceType;
import com.threadly.common.UserPrincipal;
import com.threadly.permission.PermissionClient;
import java.io.Serializable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SpiceDBPermissionEvaluator implements PermissionEvaluator {

  private final PermissionClient permissionClient;

  @Override
  public boolean hasPermission(Authentication authentication, Object targetDomainObject,
      Object permission) {
    log.info(">>> hasPermission(targetObject) invoked");
    log.info("auth={}, target={}, permission={}", authentication, targetDomainObject, permission);
    return true;
  }

  @Override
  public boolean hasPermission(Authentication authentication, Serializable targetId,
      String targetType, Object permission) {
    log.info(">>> hasPermission(id, type) invoked");

    if (authentication == null
        || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
      return false;
    }

    log.info("userId={}, id={}, type={}, permission={}",
        principal.userId(), targetId, targetType, permission);

    var canAction = permissionClient.checkPermission(
        ResourceType.valueOf(targetType.toUpperCase()),
        targetId,
        PermissionTypeRegistry.fromString(permission.toString()),
        ResourceType.USER,
        principal.userId()
    );
    log.info("canAction={}", canAction);
    return true;
  }
}
