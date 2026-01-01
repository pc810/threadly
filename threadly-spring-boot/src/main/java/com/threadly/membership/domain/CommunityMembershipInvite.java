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

@Entity
@Table(name = "community_membership_invites")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Slf4j
public class CommunityMembershipInvite {

  @EmbeddedId
  private CommunityMembershipId id;

  @Column(nullable = false)
  private UUID invitedBy;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private CommunityRole role;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  public static CommunityMembershipInvite from(CommunityMembershipId id, CommunityRole role,
      UUID invitedBy) {
    return CommunityMembershipInvite.builder().role(role).id(id).invitedBy(invitedBy)
        .build();
  }
}
