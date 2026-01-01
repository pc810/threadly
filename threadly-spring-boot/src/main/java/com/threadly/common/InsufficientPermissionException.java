package com.threadly.common;

import lombok.Getter;

@Getter
public class InsufficientPermissionException extends RuntimeException {

  private final ResourceType resource;

  private final ResourcePermissionType permission;

  private final ResourceType subject;

  public InsufficientPermissionException(String message, ResourceType resource,
      ResourcePermissionType permission, ResourceType subject) {
    super(message);
    this.resource = resource;
    this.permission = permission;
    this.subject = subject;
  }


  public static InsufficientPermissionException fromResourceToSubject(
      ResourceType resourceType,
      ResourcePermissionType resourcePermission,
      ResourceType subject
  ) {
    return new InsufficientPermissionException(
        "insufficient permission", resourceType, resourcePermission, subject
    );
  }
}
