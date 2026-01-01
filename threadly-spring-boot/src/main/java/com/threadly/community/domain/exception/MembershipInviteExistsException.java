package com.threadly.community.domain.exception;

import java.util.UUID;
import lombok.Getter;


public class MembershipInviteExistsException extends RuntimeException {

  @Getter
  private final UUID userId;

  @Getter
  private final UUID communityId;

  public MembershipInviteExistsException(UUID communityId, UUID userId) {
    super("user:%s already invited community:%s".formatted(userId, communityId));
    this.userId = userId;
    this.communityId = communityId;
  }

  public static MembershipInviteExistsException from(UUID communityId, UUID userId) {
    return new MembershipInviteExistsException(userId, communityId);
  }
}



