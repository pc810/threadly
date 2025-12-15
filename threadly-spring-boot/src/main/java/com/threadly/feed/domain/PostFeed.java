package com.threadly.feed.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
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
@Table(name = "post_feed")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Slf4j
public class PostFeed {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private UUID userId;

  @Column(nullable = false)
  private UUID postId;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @Version
  @Column(nullable = false)
  private Long version;

  public static PostFeed from(UUID postId, UUID userId) {
    return PostFeed.builder()
        .userId(userId)
        .postId(postId)
        .build();
  }
}
