package com.threadly.community.domain;

import com.threadly.community.CommunityVisibility;
import com.threadly.community.CreateCommunityRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "communities")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Slf4j
public class Community {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(length = 64, nullable = false)
  private String name;

  @Column(length = 128, nullable = false)
  private String title;

  @Column(length = 512)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private CommunityVisibility visibility;

  @Column(nullable = false)
  private boolean isNsfw;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  @Version
  @Column(nullable = false)
  private Long version;

  public static Community from(CreateCommunityRequest request) {
    return Community.builder()
        .name(request.name())
        .title(request.title())
        .description(request.description())
        .visibility(request.visibility())
        .isNsfw(request.isNsfw())
        .build();
  }

  public boolean isPublic() {
    return visibility.equals(CommunityVisibility.PUBLIC);
  }

  public boolean isRestricted() {
    return visibility.equals(CommunityVisibility.PRIVATE);
  }
}
