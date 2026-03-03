package com.threadly.comment.domain;

import com.threadly.comment.CreateCommentRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "comments")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Comment {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column
  private UUID userId;

  @Column
  private UUID postId;

  @Column
  private UUID communityId;

  @Column
  private Integer depth;

  @Column
  private UUID parentId;

  @Column
  private Integer childCount;

  @Column(columnDefinition = "jsonb", nullable = false)
  @JdbcTypeCode(SqlTypes.JSON)
  private Map<String, Object> contentJson;

  @Column(columnDefinition = "text")
  private String contentHtml;

  @Column(columnDefinition = "text")
  private String contentText;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  @Version
  @Column(nullable = false)
  private Long version;

  public static Comment from(CreateCommentRequest createCommentRequest) {
    return Comment.builder()
        .depth(createCommentRequest.depth())
        .postId(createCommentRequest.postId())
        .parentId(createCommentRequest.parentId())
        .communityId(createCommentRequest.communityId())
        .contentJson(createCommentRequest.contentJson())
        .contentHtml(createCommentRequest.contentHtml())
        .contentText(createCommentRequest.contentText())
        .userId(createCommentRequest.actorId())
          .childCount(0)
        .build();
  }

}
