package com.threadly.membership.domain;

import com.threadly.membership.CommunityMembershipId;
import com.threadly.membership.CommunityRole;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "community_memberships")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Slf4j
public class CommunityMembership {

  @EmbeddedId
  private CommunityMembershipId id;

  @Column(nullable = false)
  private UUID addedBy;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private CommunityRole role;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  public static CommunityMembership from(CommunityMembershipId communityMemberId,
      CommunityRole role, UUID addedBy) {
    return
        CommunityMembership.builder()
            .id(communityMemberId)
            .role(role)
            .addedBy(addedBy)
            .build();
  }

  public void updateRole(CommunityRole role) {
    this.setRole(role);
  }
}
