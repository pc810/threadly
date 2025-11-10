package com.threadly.membership.infrastructure.persistence;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.domain.CommunityMembership;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommunityMembershipRepository {

  Optional<CommunityMembership> findById(CommunityMembershipId id);

  Optional<CommunityMembership> findByIdAndRole(CommunityMembershipId id, CommunityRole role);

  List<CommunityMembership> findByCommunityId(UUID communityId);

  void save(CommunityMembership communityMembership);

  void delete(CommunityMembershipId id);

  boolean existsById(CommunityMembershipId id);

  boolean existsIdAndRole(CommunityMembershipId id, CommunityRole role);

  List<CommunityMembership> findByUserId(UUID userId);
}
