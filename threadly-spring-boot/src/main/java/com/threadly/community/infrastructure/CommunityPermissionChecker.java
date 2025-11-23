package com.threadly.community.infrastructure;


import com.threadly.common.AuthRole;
import com.threadly.common.PermissionChecker;
import com.threadly.common.PermissionKey;
import com.threadly.common.ResourceType;
import com.threadly.community.application.usecase.CommunityInternalApi;
import com.threadly.membership.CommunityRole;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
class CommunityPermissionChecker extends PermissionChecker {

  private final CommunityInternalApi communityInternalApi;

  public CommunityPermissionChecker(CommunityInternalApi communityInternalApi) {
    super(List.of(ResourceType.COMMUNITY, ResourceType.COMMUNITY_MEMBERSHIP));
    this.communityInternalApi = communityInternalApi;
  }

  @Override
  public boolean hasPermission(UUID actorId, PermissionKey permissionKey,
      Optional<UUID> resourceId) {

    Optional<AuthRole> role = resourceId
        .flatMap(id -> resolve(id, actorId))
        .or(() -> resolve(actorId));

//    log.info("{} role={}", this.getName(), role);

    if (role.isEmpty()) {
      return switch (permissionKey) {
        case COMMUNITY_MEMBERSHIP_ADD -> true;
        case COMMUNITY_MEMBERSHIP_VIEW -> resourceId
            .map(id -> communityInternalApi.checkMembershipViewAccess(id, AuthRole.PUBLIC))
            .orElse(false);
        default -> false;
      };
    }

    AuthRole r = role.get();

    return resourceId.map(id -> switch (permissionKey) {
      case COMMUNITY_VIEW, COMMUNITY_ADD -> communityInternalApi.checkAccess(id, r);
      case COMMUNITY_EDIT -> communityInternalApi.checkModAccess(id, r);
      case COMMUNITY_DELETE -> communityInternalApi.checkOwnerAccess(id, r);

      default -> false;
    }).orElse(false);

  }

  @Override
  public Optional<AuthRole> resolve(UUID actorId) {
    return Optional.of(AuthRole.PUBLIC);
  }

  @Override
  public Optional<AuthRole> resolve(UUID resourceId, UUID actorId) {
    return communityInternalApi.getRole(resourceId, actorId)
        .map(CommunityRole::getAuthRole);
  }

}
