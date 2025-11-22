package com.threadly.community.infrastructure;


import com.threadly.common.PermissionChecker;
import com.threadly.common.PermissionKey;
import com.threadly.common.ResourceType;
import com.threadly.community.application.usecase.CommunityInternalApi;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
class CommunityPermissionChecker extends PermissionChecker {

  private final CommunityInternalApi communityInternalApi;

  public CommunityPermissionChecker(CommunityInternalApi communityInternalApi) {
    super(List.of(ResourceType.COMMUNITY, ResourceType.COMMUNITY_MEMBERSHIP));
    this.communityInternalApi = communityInternalApi;
  }

  @Override
  public boolean hasPermission(UUID actorId, UUID resourceId, PermissionKey permissionKey) {

    return switch (permissionKey) {
      case COMMUNITY_VIEW -> communityInternalApi.canViewCommunity(actorId, resourceId);
      default -> false;
    };
  }
}
