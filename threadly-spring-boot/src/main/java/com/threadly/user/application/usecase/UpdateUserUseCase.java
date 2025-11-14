package com.threadly.user.application.usecase;

import com.threadly.user.UserUpdateRequest;
import com.threadly.user.domain.User;

public interface UpdateUserUseCase {

  User updateUser(String userId, UserUpdateRequest request);
}
