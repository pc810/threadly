package com.threadly.post.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "post_links")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostLink {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private UUID postId;

  @Column(nullable = false)
  private UUID mediaId;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String description;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  public static PostLink from(PostMetaUpdateEvent event) {
    return PostLink.builder()
        .postId(event.postId())
        .title(event.seo().title())
        .description(event.seo().description())
        .build();
  }

  public void updateFrom(PostMetaUpdateEvent event) {
    setTitle(event.seo().title());
    setDescription(event.seo().title());
  }
}
