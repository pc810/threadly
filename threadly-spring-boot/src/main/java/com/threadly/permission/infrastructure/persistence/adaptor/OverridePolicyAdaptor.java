package com.threadly.permission.infrastructure.persistence.adaptor;

import com.threadly.common.PermissionKey;
import com.threadly.permission.domain.OverridePolicy;
import com.threadly.permission.infrastructure.persistence.OverridePolicyRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class OverridePolicyAdaptor implements OverridePolicyRepository {

  private final JpaOverridePolicyRepository repository;

  @Override
  public Optional<OverridePolicy> findById(UUID id) {
    return repository.findById(id);
  }

  @Override
  public Optional<OverridePolicy> findByPermissionKey(PermissionKey permissionKey) {
    return repository.findByPermissionKey(permissionKey);
  }
}
