package com.threadly.user.application.usercase;

import java.util.UUID;

public interface DeleteUserUseCase {

  void deleteUserById(UUID userId);
}
