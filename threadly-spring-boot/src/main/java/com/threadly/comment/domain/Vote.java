package com.threadly.comment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "votes")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Vote {

  @EmbeddedId
  private VoteId id;

  @Column(nullable = false)
  private Integer direction;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @Version
  @Column(nullable = false)
  private Long version;

  public static Vote from(UUID commentId, UUID userId, Integer direction) {
    return Vote.builder()
        .id(VoteId.from(commentId, userId))
        .direction(direction)
        .build();
  }
}
