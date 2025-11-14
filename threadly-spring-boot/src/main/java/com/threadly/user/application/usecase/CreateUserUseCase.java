package com.threadly.user.application.usecase;

import com.threadly.user.LocalUserCreateRequest;
import com.threadly.user.UserCreateRequest;
import java.util.UUID;

public interface CreateUserUseCase {

  UUID createOrGetUser(UserCreateRequest request);

  UUID createUser(LocalUserCreateRequest request);

}
