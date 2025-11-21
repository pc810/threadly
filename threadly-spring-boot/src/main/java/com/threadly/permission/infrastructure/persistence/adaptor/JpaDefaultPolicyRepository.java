package com.threadly.permission.infrastructure.persistence.adaptor;

import com.threadly.common.PermissionKey;
import com.threadly.permission.domain.DefaultPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface JpaDefaultPolicyRepository extends JpaRepository<DefaultPolicy, PermissionKey> {

}
