package com.threadly.auth.application.service;

import com.threadly.auth.LoginRequest;
import com.threadly.auth.TokenDTO;
import com.threadly.auth.application.usecase.AuthInternalApi;
import com.threadly.auth.application.usecase.JwtInternalApi;
import com.threadly.auth.domain.RegisterUserRequest;
import com.threadly.common.AuthProvider;
import com.threadly.user.LocalUserCreateRequest;
import com.threadly.user.UserExternalService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
class AuthService implements AuthInternalApi {

  private final UserExternalService userService;

  private final JwtInternalApi jwtInternalApi;

  private final PasswordEncoder passwordEncoder;

  @Override
  @Transactional
  public TokenDTO login(LoginRequest loginRequest) {
    var user = userService.getUserDetailsByEmail(loginRequest.email())
        .orElseThrow(() -> new RuntimeException("Invalid credentials"));

//    if (!passwordEncoder.matches(loginRequest.password(), user.password())) {
//      throw new RuntimeException("Invalid credentials");
//    }

    if (!loginRequest.password().equals(user.password())) {
      throw new RuntimeException("Invalid credentials");
    }

    return generateTokens(user.id());
  }

  @Override
  public TokenDTO register(RegisterUserRequest request) {
    var userId = userService.createUser(
        new LocalUserCreateRequest(request.email(), request.password(), request.name(),
            AuthProvider.LOCAL,
            AuthProvider.LOCAL.toString()));

    return generateTokens(userId);
  }

  private TokenDTO generateTokens(UUID userId) {

    String accessToken = jwtInternalApi.createAccessToken(userId, Map.of("role", "USER"));
    String refreshToken = jwtInternalApi.createRefreshToken(userId);

    return new TokenDTO(accessToken, refreshToken, jwtInternalApi.getExpiration(),
        jwtInternalApi.getExpiration() * 2,
        jwtInternalApi.getExpirationDate());
  }
}
