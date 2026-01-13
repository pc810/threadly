package com.threadly.post.domain;

import com.threadly.post.CreatePostRequest;
import com.threadly.post.PostType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "posts")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Slf4j
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column
  private UUID userId;

  @Column
  private UUID communityId;

  @Column(nullable = false)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private PostType type;

  @Column(columnDefinition = "jsonb", nullable = false)
  @JdbcTypeCode(SqlTypes.JSON)
  private Map<String, Object> contentJson;

  @Lob
  @Column(columnDefinition = "text")
  private String contentHtml;

  @Lob
  @Column(columnDefinition = "text")
  private String contentText;

  @Column(columnDefinition = "text")
  private String link;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  @Version
  @Column(nullable = false)
  private Long version;

  public static Post from(CreatePostRequest request, UUID userId) {
    var postBuilder = Post.builder()
        .userId(userId)
        .title(request.title())
        .communityId(request.communityId())
        .type(request.type());

    switch (request.type()) {
      case TEXT -> postBuilder.contentJson(request.contentJson())
          .contentHtml(request.contentHtml())
          .contentText(request.contentText())
          .link("");
      case MEDIA -> postBuilder.contentJson(Map.of())
          .contentHtml("")
          .contentText("")
          .link("");
      case LINK -> postBuilder.contentJson(Map.of())
          .contentHtml("")
          .contentText("")
          .link(request.link());
    }

    return postBuilder
        .build();
  }

  public boolean isLinkType() {
    return this.type.equals(PostType.LINK);
  }

  public boolean isTextType() {
    return this.type.equals(PostType.TEXT);
  }

  public boolean isMediaType() {
    return this.type.equals(PostType.MEDIA);
  }
}
