package com.threadly.permission.domain;

import com.threadly.common.AuthRole;
import com.threadly.common.PermissionKey;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "override_policy")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OverridePolicy {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private PermissionKey permissionKey;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private AuthRole role;

  @Column(nullable = false)
  private String resourceId;

}
