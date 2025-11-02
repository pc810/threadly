package com.threadly.auth.application.usecase;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import java.util.UUID;

public interface ParseTokenUseCase {

  Jws<Claims> parse(String token);

  UUID parseUserId(String token);

  boolean validateToken(String token);
}
