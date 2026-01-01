package com.threadly.membership.infrastructure.persistence.adaptor;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.domain.CommunityMembershipInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpaCommunityMembershipInviteRepository extends JpaRepository
    <CommunityMembershipInvite, CommunityMembershipId>,
    JpaSpecificationExecutor<CommunityMembershipInvite> {

}
