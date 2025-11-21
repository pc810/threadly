package com.threadly.common;

import java.util.UUID;

public record PermissionContext(
    UUID userId,
    UUID resourceId,
    PermissionKey permissionKey
) {}
