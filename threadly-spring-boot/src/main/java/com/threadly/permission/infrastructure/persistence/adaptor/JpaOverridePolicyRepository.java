package com.threadly.permission.infrastructure.persistence.adaptor;

import com.threadly.common.PermissionKey;
import com.threadly.permission.domain.OverridePolicy;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface JpaOverridePolicyRepository extends JpaRepository<OverridePolicy, UUID> {

  Optional<OverridePolicy> findByPermissionKey(PermissionKey permissionKey);
}
