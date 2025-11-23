package com.threadly.post.application.usecase;

import com.threadly.common.AuthRole;
import com.threadly.membership.CommunityRole;
import java.util.Optional;
import java.util.UUID;

public interface GetPostRoleUseCase {

  Optional<AuthRole> getRole(UUID postId, UUID actorId);

  Optional<CommunityRole> getCommunityRole(UUID communityId, UUID actorId);

}
