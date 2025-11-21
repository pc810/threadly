package com.threadly.common;

import java.util.UUID;

public interface PermissionService extends CommunityPermission, PostPermission {

}

interface PostPermission {

  boolean canEditPost(UUID postId, UUID actorId);

  boolean canDeletePost(UUID postId, UUID actorId);

  boolean canViewPost(UUID postId, UUID actorId);
}

interface CommunityPermission {

  boolean canPostCommunity(UUID communityId, UUID actorId);

  boolean canViewCommunity(UUID communityId, UUID actorId);

  boolean canAddMemberCommunity(UUID communityId, UUID actorId);
}