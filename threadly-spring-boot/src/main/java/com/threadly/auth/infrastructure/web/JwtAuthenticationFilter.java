package com.threadly.auth.infrastructure.web;

import com.threadly.auth.application.service.JwtService;
import com.threadly.auth.application.usecase.JwtInternalApi;
import com.threadly.common.UserPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtInternalApi jwtService;

  private final AntPathMatcher pathMatcher;

  public JwtAuthenticationFilter(JwtService jwtService, AntPathMatcher pathMatcher) {
    this.jwtService = jwtService;
    this.pathMatcher = pathMatcher;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return SecurityConstants.PUBLIC_ENDPOINTS
        .stream()
        .anyMatch(p -> pathMatcher.match(p, request.getRequestURI()));
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String header = request.getHeader("Authorization");
    String token = null;

    if (header != null && header.startsWith("Bearer ")) {
      token = header.substring(7);
    }

    if (token != null && jwtService.validateToken(token)) {
      UUID userId = jwtService.parseUserId(token);

      var auth = new UsernamePasswordAuthenticationToken(new UserPrincipal(userId), null,
          List.of(new SimpleGrantedAuthority("ROLE_USER")));

      SecurityContextHolder.getContext().setAuthentication(auth);
    }

    filterChain.doFilter(request, response);
  }
}