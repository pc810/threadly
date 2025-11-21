package com.threadly.permission.infrastructure.persistence;

import com.threadly.common.PermissionKey;
import com.threadly.permission.domain.OverridePolicy;
import java.util.Optional;
import java.util.UUID;

public interface OverridePolicyRepository {

  Optional<OverridePolicy> findById(UUID id);

  Optional<OverridePolicy> findByPermissionKey(PermissionKey permissionKey);

}
