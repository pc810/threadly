package com.threadly.community.application.usecase;

import com.threadly.common.AuthRole;
import java.util.UUID;

public interface CanActionUseCase {

  boolean checkAccess(UUID communityId, AuthRole authRole);

  boolean checkModAccess(UUID communityId, AuthRole authRole);

  boolean checkOwnerAccess(UUID communityId, AuthRole authRole);

  boolean checkMembershipViewAccess(UUID id, AuthRole authRole);
}
