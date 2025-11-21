package com.threadly.permission.domain;

import com.threadly.common.AuthRole;
import com.threadly.common.PermissionKey;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "default_policy")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DefaultPolicy {

  @Id
  @Enumerated(EnumType.STRING)
  private PermissionKey permissionKey;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private AuthRole role;
}
