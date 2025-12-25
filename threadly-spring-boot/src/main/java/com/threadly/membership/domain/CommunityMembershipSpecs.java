package com.threadly.membership.domain;

import com.threadly.membership.CommunityRole;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public class CommunityMembershipSpecs {

  public static Specification<CommunityMembership> hasCommunityId(UUID communityId) {
    return ((root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("id").get("communityId"), communityId));
  }

  public static Specification<CommunityMembership> hasRole(CommunityRole role) {
    return ((root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("role"), role));
  }
}
