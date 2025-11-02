package com.threadly.auth.application.service;

import com.threadly.auth.application.usecase.GenerateAccessTokenUseCase;
import com.threadly.auth.application.usecase.GenerateRefreshTokenUseCase;
import com.threadly.auth.application.usecase.GetExpirationUseCase;
import com.threadly.auth.application.usecase.JwtInternalApi;
import com.threadly.auth.application.usecase.ParseTokenUseCase;
import com.threadly.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService implements JwtInternalApi {

  private final Key key;
  private final JwtProperties jwtProperties;

  public JwtService(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
    this.key = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes());
  }

  @Override
  public String createAccessToken(UUID userId, Map<String, Object> extraClaims) {
    var now = Instant.now();
    return Jwts.builder()
        .id(UUID.randomUUID().toString())
        .subject(String.valueOf(userId))
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusMillis(jwtProperties.accessMs())))
        .claims(extraClaims)
        .signWith(key)
        .compact();
  }

  @Override
  public String createRefreshToken(UUID userId) {
    Instant now = Instant.now();
    return Jwts.builder()
        .id(UUID.randomUUID().toString())
        .subject(userId.toString())
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusMillis(jwtProperties.refreshMs())))
        .claim("typ", "refresh")
        .signWith(key)
        .compact();
  }

  @Override
  public Jws<Claims> parse(String token) {
    return Jwts.parser()
        .verifyWith((SecretKey) key)
        .build()
        .parseSignedClaims(token);
  }

  @Override
  public UUID parseUserId(String token) {
    return UUID.fromString(
        parse(token)
            .getPayload()
            .getSubject()
    );
  }

  @Override
  public boolean validateToken(String token) {
    try {
      parse(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  @Override
  public long getExpiration() {
    return jwtProperties.accessMs();
  }

  @Override
  public Instant getExpirationDate() {
    return Instant.from(Instant.now().plusMillis(getExpiration()));
  }
}
