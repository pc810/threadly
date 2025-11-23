package com.threadly.community.domain.exception;

import java.util.UUID;
import org.jetbrains.annotations.NotNull;

public class CommunityNotFoundException extends RuntimeException {

  public CommunityNotFoundException(UUID communityId) {
    super("community not found " + communityId);
  }

  public static @NotNull RuntimeException byId(UUID communityId) {
    return new CommunityNotFoundException(communityId);
  }
}
