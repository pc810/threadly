package com.threadly.auth.infrastructure.web;

import com.threadly.auth.TokenDTO;
import com.threadly.auth.application.service.AuthInternalApi;
import com.threadly.auth.domain.RegisterUserRequest;
import com.threadly.common.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthInternalApi authInternalApi;
  private final CookieUtil cookieUtil;

  @Operation(
      summary = "Register a new user",
      description = "Registers a user using email and password, issues JWT cookies."
  )
  @PostMapping("register")
  public ResponseEntity<TokenDTO> register(
      @RequestParam String name,
      @RequestParam String email,
      @RequestParam String password,
      HttpServletResponse response) {

    var tokenDTO = authInternalApi.register(new RegisterUserRequest(
        email, password
    ));

    cookieUtil.addCookie(response, "access_token", tokenDTO.accessToken(), tokenDTO.expires());
    cookieUtil.addCookie(response, "refresh_token", tokenDTO.refreshToken(),
        tokenDTO.expiresRefreshToken());

    return ResponseEntity.ok(tokenDTO);
  }


  @Operation(
      summary = "Login user",
      description = "Authenticates a user and returns JWT tokens in HttpOnly cookies."
  )
  @PostMapping("login")
  public ResponseEntity<TokenDTO> login(
      @RequestParam String email,
      @RequestParam String password,
      HttpServletResponse response) {

    TokenDTO tokenDTO = authInternalApi.login(email, password);

    cookieUtil.addCookie(response, "access_token", tokenDTO.accessToken(),
        tokenDTO.expires());
    cookieUtil.addCookie(response, "refresh_token", tokenDTO.refreshToken(),
        tokenDTO.expiresRefreshToken());

    return ResponseEntity.ok(tokenDTO);
  }

//  @Operation(
//      summary = "Refresh access token",
//      description = "Uses refresh token cookie to generate a new access token."
//  )
//  @PostMapping("/refresh")
//  public ResponseEntity<TokenDTO> refresh(HttpServletResponse response,
//      @CookieValue("refresh_token") String refreshToken) {
//    TokenDTO tokens = authInternalApi.refresh(refreshToken, response);
//    return ResponseEntity.ok(tokens);
//  }


  @Operation(
      summary = "Logout user",
      description = "Clears access and refresh token cookies."
  )
  @PostMapping("logout")
  public ResponseEntity<Void> logout(HttpServletResponse response) {
    cookieUtil.clearCookie(response, "access_token");
    cookieUtil.clearCookie(response, "refresh_token");
    return ResponseEntity.noContent().build();
  }

}
