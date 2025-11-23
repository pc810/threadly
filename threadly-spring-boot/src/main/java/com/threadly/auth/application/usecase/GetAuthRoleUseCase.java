package com.threadly.auth.application.usecase;

import com.threadly.common.AuthRole;
import java.util.UUID;

public interface GetAuthRoleUseCase {

  AuthRole getRole(UUID userId);
}
