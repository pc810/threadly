package com.threadly.auth.application.usecase;

import com.threadly.auth.LoginRequest;
import com.threadly.auth.TokenDTO;

public interface LoginUserUseCase {

  TokenDTO login(LoginRequest loginRequest);
}
