package com.threadly.post.infrastructure;

import com.threadly.common.AuthRole;
import com.threadly.common.PermissionChecker;
import com.threadly.common.PermissionKey;
import com.threadly.common.ResourceType;
import com.threadly.community.CommunityExternalApi;
import com.threadly.post.application.usecase.PostInternalApi;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
class PostPermissionChecker extends PermissionChecker {

  private final PostInternalApi postInternalApi;

  public PostPermissionChecker(List<ResourceType> supportedResources,
      CommunityExternalApi communityExternalApi, PostInternalApi postInternalApi) {
    super(List.of(ResourceType.POST));
    this.postInternalApi = postInternalApi;
  }

  @Override
  public boolean hasPermission(UUID actorId, PermissionKey permissionKey,
      Optional<UUID> resourceId) {

    Optional<AuthRole> postRole = resourceId
        .flatMap(id -> resolve(id, actorId))
        .or(() -> resolve(actorId));

    if (postRole.isEmpty()) {
      return false;
    }

    var role = postRole.get();
    return resourceId.map(id -> {
      var post = postInternalApi.getPost(id).orElseThrow();
      var communityId = post.getCommunityId();
      var communityRole = postInternalApi.getCommunityRole(communityId, actorId);

      return switch (permissionKey) {
        case POST_VIEW ->
            communityRole.map(cr -> postInternalApi.checkReadAccess(role, cr)).orElse(false);
        case POST_EDIT -> role == AuthRole.AUTHOR;
        case POST_DELETE ->
            communityRole.map(cr -> postInternalApi.checkModAccess(role, cr)).orElse(false);
        default -> false;
      };

    }).orElse(false);
  }

  @Override
  public Optional<AuthRole> resolve(UUID actorId) {
    return Optional.empty();
  }

  @Override
  public Optional<AuthRole> resolve(UUID resourceId, UUID actorId) {
    return postInternalApi.getRole(resourceId, actorId);
  }

}
