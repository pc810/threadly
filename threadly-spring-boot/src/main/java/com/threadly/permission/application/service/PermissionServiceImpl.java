package com.threadly.permission.application.service;

import com.threadly.common.PermissionService;
import com.threadly.community.CommunityExternalApi;
import com.threadly.post.PostExternalApi;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
class PermissionServiceImpl implements PermissionService {

  private CommunityExternalApi communityExternalApi;
  private PostExternalApi postExternalApi;

  @Override
  public boolean canPostCommunity(UUID communityId, UUID actorId) {
    return true;
  }

  @Override
  public boolean canViewCommunity(UUID communityId, UUID actorId) {
    return true;
  }

  @Override
  public boolean canAddMemberCommunity(UUID communityId, UUID actorId) {
    return true;
  }

  @Override
  public boolean canEditPost(UUID postId, UUID actorId) {
    return true;
  }

  @Override
  public boolean canDeletePost(UUID postId, UUID actorId) {
    return true;
  }

  @Override
  public boolean canViewPost(UUID postId, UUID actorId) {
    return true;
  }
}
