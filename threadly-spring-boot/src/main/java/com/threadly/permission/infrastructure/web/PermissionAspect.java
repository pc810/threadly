package com.threadly.permission.infrastructure.web;

import com.threadly.common.PermissionContext;
import com.threadly.common.Permissions;
import com.threadly.permission.PermissionService;
import com.threadly.permission.domain.exception.PermissionDeniedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@RequiredArgsConstructor
@Component
public class PermissionAspect {

  private final PermissionService permissionService;

  @Before("@annotation(permissions)")
  public void checkPermission(JoinPoint joinPoint, Permissions permissions) throws Exception {
//    log.info("joinPoint={}", joinPoint.getSignature());

    PermissionContext ctx = null;
    for (Object arg : joinPoint.getArgs()) {
      if (arg instanceof PermissionContext c) {
        ctx = c;
        break;
      }
    }

//    log.info("permissionContext={}", ctx);

    if (ctx == null) {
      throw new AccessDeniedException("PermissionContext missing");
    }

    if (!permissionService.hasPermission(ctx)) {
      throw PermissionDeniedException.from(ctx);
    }
  }
}


