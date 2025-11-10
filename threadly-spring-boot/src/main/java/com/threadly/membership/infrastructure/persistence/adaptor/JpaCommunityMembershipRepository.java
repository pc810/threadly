package com.threadly.membership.infrastructure.persistence.adaptor;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.domain.CommunityMembership;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaCommunityMembershipRepository extends
    JpaRepository<CommunityMembership, CommunityMembershipId> {

  Optional<CommunityMembership> findByIdAndRole(CommunityMembershipId id, CommunityRole role);

  List<CommunityMembership> findById_CommunityId(UUID communityId);

  List<CommunityMembership> findById_UserId(UUID userId);

  boolean existsByIdAndRole(CommunityMembershipId id, CommunityRole role);

}
