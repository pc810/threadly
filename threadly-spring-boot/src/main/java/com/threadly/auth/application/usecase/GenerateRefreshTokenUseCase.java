package com.threadly.auth.application.usecase;

import java.util.UUID;

public interface GenerateRefreshTokenUseCase {

  String createRefreshToken(UUID userId);
}

