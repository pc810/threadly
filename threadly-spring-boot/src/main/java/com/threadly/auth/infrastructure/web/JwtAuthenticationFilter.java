package com.threadly.auth.infrastructure.web;

import com.threadly.auth.application.service.JwtService;
import com.threadly.auth.application.usecase.JwtInternalApi;
import com.threadly.common.UserPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtInternalApi jwtService;

  public JwtAuthenticationFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.startsWith("/swagger")
        || path.startsWith("/v3/api-docs")
        || path.startsWith("/swagger-ui")
        || path.startsWith("/swagger-resources")
        || path.startsWith("/webjars")
        || path.equals("/auth/login")
        || path.equals("/auth/register")
        || path.equals("/auth/logout")
        || path.startsWith("/oauth2")
        || path.startsWith("/public");
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

//    log.info("JwtAuthenticationFilter executing for {}", request.getRequestURI());

    String token = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
        .filter(c -> c.getName().equals("access_token"))
        .map(Cookie::getValue)
        .findFirst()
        .orElse(null);

//    log.info("JWT filter token={} valid={}", token, jwtService.validateToken(token));

    if (token != null && jwtService.validateToken(token)) {
      UUID userId = jwtService.parseUserId(token);

      var auth = new UsernamePasswordAuthenticationToken(
          new UserPrincipal(userId),
          null,
          List.of(new SimpleGrantedAuthority("ROLE_USER"))
      );

      SecurityContextHolder.getContext().setAuthentication(auth);
    }

    filterChain.doFilter(request, response);
  }
}
