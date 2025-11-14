package com.threadly.user.application.usecase;

import java.util.UUID;

public interface DeleteUserUseCase {

  void deleteUserById(UUID userId);
}
