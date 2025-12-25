package com.threadly.membership.infrastructure.persistence.adaptor;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.CommunityRole;
import com.threadly.membership.domain.CommunityMembership;
import com.threadly.membership.infrastructure.persistence.CommunityMembershipRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class CommunityMembershipPersistenceAdaptor implements CommunityMembershipRepository {

  private final JpaCommunityMembershipRepository repository;

  @Override
  public Optional<CommunityMembership> findById(CommunityMembershipId id) {
    return repository.findById(id);
  }


  @Override
  public List<CommunityMembership> findByCommunityId(UUID communityId) {
    return repository.findById_CommunityId(communityId);
  }

  @Override
  public boolean existsIdAndRole(CommunityMembershipId id,
      CommunityRole role) {
    return repository.existsByIdAndRole(id, role);
  }

  @Override
  public List<CommunityMembership> findByUserId(UUID userId) {
    return repository.findById_UserId(userId);
  }

  @Override
  public Page<CommunityMembership> findAll(Specification<CommunityMembership> spec,
      Pageable pageable) {
    return repository.findAll(spec, pageable);
  }

  @Override
  public void save(CommunityMembership communityMembership) {
    repository.save(communityMembership);
  }

  @Override
  public void delete(CommunityMembershipId id) {
    var communityMembership = findById(id).orElseThrow(
        () -> new IllegalArgumentException("not found"));
    repository.delete(communityMembership);
  }

  @Override
  public boolean existsById(CommunityMembershipId id) {
    return repository.existsById(id);
  }
}
