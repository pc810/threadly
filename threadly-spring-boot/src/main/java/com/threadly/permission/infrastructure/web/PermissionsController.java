package com.threadly.permission.infrastructure.web;

import com.authzed.api.v1.Consistency;
import com.threadly.common.PermissionTypeRegistry;
import com.threadly.common.ResourcePermissionType;
import com.threadly.common.ResourceType;
import com.threadly.common.UserPrincipal;
import com.threadly.permission.PermissionClient;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
class PermissionsController {

  private final PermissionClient permissionClient;

  @GetMapping
  ResponseEntity<Map<ResourcePermissionType, Boolean>> getPermissions(
      @RequestParam(required = true) List<String> permissions,
      @RequestParam(required = true) String resourceId,
      @RequestParam(required = true) String resourceType,
      @RequestParam(required = false, defaultValue = "true") Boolean minimizeLatency,
      @AuthenticationPrincipal UserPrincipal principal
  ) {

    var map = permissions.stream()
        .map(PermissionTypeRegistry::fromString)
        .collect(
            Collectors.toMap(
                permission -> permission,
                permission -> permissionClient.checkPermissionWithConsistency(
                    ResourceType.valueOf(resourceType),
                    resourceId,
                    permission,
                    ResourceType.USER,
                    principal.getUserId(),
                    minimizeLatency ? Consistency.newBuilder()
                        .setMinimizeLatency(true)
                        .build() :
                        Consistency.newBuilder()
                            .setFullyConsistent(true)
                            .build()
                )
            )
        );

    return ResponseEntity.ok(map);
  }
}
