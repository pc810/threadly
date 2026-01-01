package com.threadly.membership.infrastructure.persistence.adaptor;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.domain.CommunityMembershipInvite;
import com.threadly.membership.infrastructure.persistence.CommunityMembershipInviteRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class CommunityMembershipInvitePersistenceAdaptor implements CommunityMembershipInviteRepository {

  private final JpaCommunityMembershipInviteRepository repository;

  @Override
  public Optional<CommunityMembershipInvite> findById(CommunityMembershipId id) {
    return repository.findById(id);
  }

  @Override
  public Page<CommunityMembershipInvite> findAll(
      Specification<CommunityMembershipInvite> specification, Pageable pageable) {
    return repository.findAll(specification, pageable);
  }

  @Override
  public void save(CommunityMembershipInvite communityMembershipInvite) {
    repository.save(communityMembershipInvite);
  }

  @Override
  public void delete(CommunityMembershipInvite membershipInvite) {
    repository.delete(membershipInvite);
  }
}
