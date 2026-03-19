package com.threadly.vote.domain;

import com.threadly.vote.VoteDTO;
import com.threadly.vote.VoteId;
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
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "votes")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Vote {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private UUID userId;

  @Column
  private UUID postId;

  @Column
  private UUID commentId;

  @Column(nullable = false)
  private Integer direction;

  @CreationTimestamp
  @Column(updatable = false, nullable = false)
  private Instant createdAt;

  @Version
  @Column(nullable = false)
  private Long version;


  public static Vote from(VoteId id, Integer direction) {
    return Vote.builder()
        .postId(id.postId())
        .commentId(id.commentId())
        .direction(direction)
        .build();
  }

  public static VoteDTO toDTO(Vote vote) {
    return new VoteDTO(
        new VoteId(vote.getUserId(), vote.getCommentId(), vote.getPostId()),
        vote.getDirection()
    );
  }
}
