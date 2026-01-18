package com.threadly.auth.application.usecase;

import com.threadly.auth.LoginRequest;
import com.threadly.auth.TokenDTO;
import java.util.Optional;

public interface LoginUserUseCase {

  TokenDTO login(LoginRequest loginRequest);

  Optional<TokenDTO> refresh(String refreshToken);
}
