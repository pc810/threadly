package com.threadly.community.domain.exception;

import java.util.UUID;
import lombok.Getter;

public class MembershipAlreadyExistsException extends RuntimeException {

  @Getter
  private final UUID userId;

  @Getter
  private final UUID communityId;

  public MembershipAlreadyExistsException(UUID communityId, UUID userId) {
    super("user:%s already member community:%s".formatted(userId, communityId));
    this.userId = userId;
    this.communityId = communityId;
  }

  public static MembershipAlreadyExistsException from(UUID communityId, UUID userId) {
    return new MembershipAlreadyExistsException(communityId, userId);
  }
}
