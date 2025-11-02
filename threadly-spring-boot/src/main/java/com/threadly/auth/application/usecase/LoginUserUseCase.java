package com.threadly.auth.application.usecase;

import com.threadly.auth.TokenDTO;

public interface LoginUserUseCase {

  TokenDTO login(String email, String rawPassword);
}
