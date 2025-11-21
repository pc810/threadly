package com.threadly.permission.infrastructure.persistence;

import com.threadly.common.PermissionKey;
import com.threadly.permission.domain.DefaultPolicy;
import java.util.Optional;

public interface DefaultPolicyRepository {

  Optional<DefaultPolicy> findByKey(PermissionKey permissionKey);
}
