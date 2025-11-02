package com.threadly.user.domain;

import com.threadly.common.AuthProvider;
import com.threadly.user.LocalUserCreateRequest;
import com.threadly.user.UserCreateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true, length = 50)
  private String username;

  @Column(unique = true)
  private String email;

  @Column
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AuthProvider authProvider;

  @Column(name = "provider_id")
  private String providerId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AccountStatus status;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @Column
  private Instant lastLoginAt;

  @Version
  @Column(nullable = false)
  private Long version;

  public static User from(LocalUserCreateRequest request) {
    return User.builder()
        .email(request.email())
        .username(request.email().split("@")[0])
        .passwordHash(request.passwordHash())
        .authProvider(request.authProvider())
        .version(0L)
        .providerId(request.providerId()).build();
  }

  public static User from(UserCreateRequest request) {
    return User.builder()
        .email(request.email())
        .username(request.email().split("@")[0])
        .passwordHash(request.email())
        .authProvider(request.authProvider())
        .version(0L)
        .providerId(request.authProvider().toString()).build();
  }

  public static AuthProvider convertStringToAuthProvider(String provider) {
    try {
      return AuthProvider.valueOf(provider.toUpperCase());
    } catch (IllegalArgumentException e) {
      log.warn("Invalid auth provider: {}", provider);
      return null;
    }
  }

  @PrePersist
  protected void onCreate() {
    if (status == null) {
      status = AccountStatus.ACTIVE;
    }
    if (authProvider == null) {
      authProvider = AuthProvider.LOCAL;
    }
  }

  public enum AccountStatus {
    ACTIVE, SUSPENDED, DELETED
  }
}