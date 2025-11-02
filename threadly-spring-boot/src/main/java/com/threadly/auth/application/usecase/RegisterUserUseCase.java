package com.threadly.auth.application.usecase;

import com.threadly.auth.TokenDTO;
import com.threadly.auth.domain.RegisterUserRequest;

public interface RegisterUserUseCase {

  TokenDTO register(RegisterUserRequest request);
}
