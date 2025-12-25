package com.threadly.membership.infrastructure.persistence.adaptor;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.domain.CommunityMembership;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpaCommunityMembershipRepository extends
    JpaRepository<CommunityMembership, CommunityMembershipId>,
    JpaSpecificationExecutor<CommunityMembership> {

  Optional<CommunityMembership> findByIdAndRole(CommunityMembershipId id, CommunityRole role);

  List<CommunityMembership> findById_CommunityId(UUID communityId);

  Slice<CommunityMembership> findById_CommunityId(UUID communityId, Pageable pageable);

  List<CommunityMembership> findById_UserId(UUID userId);

  boolean existsByIdAndRole(CommunityMembershipId id, CommunityRole role);

}
