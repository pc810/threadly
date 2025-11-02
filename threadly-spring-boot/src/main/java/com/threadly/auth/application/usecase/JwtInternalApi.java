package com.threadly.auth.application.usecase;

public interface JwtInternalApi extends GenerateRefreshTokenUseCase, GenerateAccessTokenUseCase,
    ParseTokenUseCase, GetExpirationUseCase {

}
