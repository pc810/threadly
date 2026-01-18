package com.threadly.auth.application.service;


import com.threadly.common.AuthProvider;
import com.threadly.common.CookieUtil;
import com.threadly.common.UserUtil;
import com.threadly.user.UserCreateRequest;
import com.threadly.user.UserExternalService;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final UserExternalService userExternalService;
  private final JwtService jwtService;
  private final CookieUtil cookieUtil;

  @Override
  public void onAuthenticationSuccess(
      jakarta.servlet.http.HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication
  ) throws IOException {
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");
    String name = oAuth2User.getAttribute("name");

    var userRequest = new UserCreateRequest(
        email,
        UserUtil.getUsername(email),
        AuthProvider.GOOGLE
    );

    var userId = userExternalService.createOrGetUser(userRequest);

    String refreshToken = jwtService.createRefreshToken(userId);
    long expires = jwtService.getExpiration();

    cookieUtil.addCookie(response, "refresh_token", refreshToken, expires * 2);

    response.sendRedirect("http://localhost:3002/login/success");
  }

}
