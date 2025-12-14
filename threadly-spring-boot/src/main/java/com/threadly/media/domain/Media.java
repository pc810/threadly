package com.threadly.media.domain;

import com.threadly.common.MediaProvider;
import com.threadly.media.CreateMediaEvent;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "medias")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Media {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private UUID postId;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private MediaProvider provider;

  @Column(nullable = false)
  private String basePath;

  @Column(nullable = false)
  private String filename;

  @Column(nullable = false)
  private Integer width;

  @Column(nullable = false)
  private Integer height;

  @Column(nullable = false)
  private String contentType;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  public static Media from(CreateMediaEvent event) {
    return Media.builder()
        .postId(event.postId())
        .provider(MediaProvider.from(event.provider()))
        .basePath(event.basePath())
        .filename(event.filename())
        .width(event.dimension().width())
        .height(event.dimension().height())
        .contentType(event.contentType())
        .build();
  }

  public boolean isImage() {
    return contentType.startsWith("image");
  }

}
