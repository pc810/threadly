package com.threadly.auth.application.usecase;

import java.util.Map;
import java.util.UUID;

public interface GenerateAccessTokenUseCase {

  String createAccessToken(UUID userId, Map<String, Object> extraClaims);
}

