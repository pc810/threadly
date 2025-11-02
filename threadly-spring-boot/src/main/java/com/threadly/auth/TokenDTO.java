package com.threadly.auth;

import java.time.Instant;

public record TokenDTO(
    String accessToken,
    String refreshToken,
    Long expires,
    Long expiresRefreshToken,
    Instant expiresAt
) {

}
