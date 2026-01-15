package com.threadly.auth.infrastructure.web;

import com.threadly.auth.application.service.OAuth2SuccessHandler;
import com.threadly.auth.application.service.OAuth2UserService;
import com.threadly.config.RestAccessDeniedHandler;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
class SecurityConfig {

  private final RestAccessDeniedHandler restAccessDeniedHandler;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  public UserDetailsService userDetailsService(PasswordEncoder encoder) {

    UserDetails user = User.withUsername("admin")
        .password(encoder.encode("admin"))
        .roles("USER")
        .build();
    return new InMemoryUserDetailsManager(user);
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000","http://localhost:3002", "http://localhost:8080"));
    config.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*")); // allow all headers
    config.setAllowCredentials(true);
    config.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
    config.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http,
      UserDetailsService userDetailsService,
      OAuth2UserService customOAuth2UserService,
      OAuth2SuccessHandler successHandler,
      JwtAuthenticationFilter jwtAuthFilter) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .exceptionHandling(ex -> ex.accessDeniedHandler(restAccessDeniedHandler))
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
            .successHandler(successHandler)
        )
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/public/**",
                "/auth/login",
                "/auth/logout",
                "/auth/register",
                "/communities/name/**",
                "/users/name/**",
                "/oauth2/**",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/swagger-resources/**",
                "/webjars/**"
            ).permitAll()
            .anyRequest().authenticated()
        )
//        .formLogin(Customizer.withDefaults())
        .userDetailsService(userDetailsService)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public MethodSecurityExpressionHandler methodSecurityExpressionHandler(
      PermissionEvaluator evaluator
  ) {
    DefaultMethodSecurityExpressionHandler handler =
        new DefaultMethodSecurityExpressionHandler();
    handler.setPermissionEvaluator(evaluator);
    return handler;
  }
}
