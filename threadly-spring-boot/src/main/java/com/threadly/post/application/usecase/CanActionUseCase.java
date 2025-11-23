package com.threadly.post.application.usecase;

import com.threadly.common.AuthRole;
import com.threadly.membership.CommunityRole;

public interface CanActionUseCase {

  boolean checkAccess(AuthRole postRole, CommunityRole communityRole);

  boolean checkModAccess(AuthRole postRole, CommunityRole communityRole);

  boolean checkReadAccess(AuthRole postRole, CommunityRole communityRole);
}
