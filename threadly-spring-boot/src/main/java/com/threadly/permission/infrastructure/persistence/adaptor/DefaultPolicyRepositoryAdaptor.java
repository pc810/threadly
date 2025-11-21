package com.threadly.permission.infrastructure.persistence.adaptor;

import com.threadly.common.PermissionKey;
import com.threadly.permission.domain.DefaultPolicy;
import com.threadly.permission.infrastructure.persistence.DefaultPolicyRepository;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
class DefaultPolicyRepositoryAdaptor implements DefaultPolicyRepository {

  private final JpaDefaultPolicyRepository repository;

  @Override
  public Optional<DefaultPolicy> findByKey(PermissionKey permissionKey) {
    return repository.findById(permissionKey);
  }
}
