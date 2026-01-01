package com.threadly.membership.infrastructure.persistence;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.domain.CommunityMembershipInvite;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface CommunityMembershipInviteRepository {

  Optional<CommunityMembershipInvite> findById(CommunityMembershipId id);

  Page<CommunityMembershipInvite> findAll(Specification<CommunityMembershipInvite> specification,
      Pageable pageable);

  void save(CommunityMembershipInvite communityMembershipInvite);

  void delete(CommunityMembershipInvite communityMembershipInvite);
}
