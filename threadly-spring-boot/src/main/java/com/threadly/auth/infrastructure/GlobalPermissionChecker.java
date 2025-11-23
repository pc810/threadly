package com.threadly.auth.infrastructure;

import com.threadly.auth.application.usecase.AuthInternalApi;
import com.threadly.common.AuthRole;
import com.threadly.common.PermissionChecker;
import com.threadly.common.PermissionKey;
import com.threadly.common.ResourceType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class GlobalPermissionChecker extends PermissionChecker {

  private final AuthInternalApi authInternalApi;

  public GlobalPermissionChecker(
      AuthInternalApi authInternalApi) {
    super(List.of(ResourceType.COMMUNITY, ResourceType.COMMUNITY_MEMBERSHIP, ResourceType.POST));
    this.authInternalApi = authInternalApi;
  }

  @Override
  public boolean supports(PermissionKey permissionKey) {
    return true;
  }

  @Override
  public boolean hasPermission(UUID actorId, PermissionKey permissionKey,
      Optional<UUID> resourceId) {

    var role = resolve(actorId).orElse(AuthRole.PUBLIC);

    return switch (permissionKey) {
      case COMMUNITY_VIEW, POST_VIEW -> role == AuthRole.USER || role == AuthRole.PUBLIC;
      case COMMUNITY_ADD,
           COMMUNITY_EDIT,
           COMMUNITY_DELETE,
           COMMUNITY_MEMBERSHIP_VIEW,
           COMMUNITY_MEMBERSHIP_ADD,
           COMMUNITY_MEMBERSHIP_EDIT,
           COMMUNITY_MEMBERSHIP_DELETE,
           POST_DELETE,
           POST_EDIT -> role == AuthRole.USER;
      default -> false;
    };
  }

  @Override
  public Optional<AuthRole> resolve(UUID actorId) {
    return Optional.of(authInternalApi.getRole(actorId));
  }

  @Override
  public Optional<AuthRole> resolve(UUID resourceId, UUID actorId) {
    return Optional.empty();
  }

}
