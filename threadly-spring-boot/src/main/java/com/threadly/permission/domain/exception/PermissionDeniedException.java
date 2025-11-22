package com.threadly.permission.domain.exception;

import com.threadly.common.PermissionContext;
import com.threadly.common.PermissionKey;
import java.util.List;
import lombok.Getter;
import org.springframework.security.access.AccessDeniedException;

@Getter
public class PermissionDeniedException extends AccessDeniedException {

  private List<PermissionKey> keys;

  public PermissionDeniedException(List<PermissionKey> keys) {
    super("");
    this.keys = keys;
  }

  public static Exception from(PermissionContext ctx) {
    return new PermissionDeniedException(ctx.permissionKeys());
  }

  @Override
  public String toString() {
    return "missing permissions :: " + keys;
  }
}