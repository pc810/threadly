package com.threadly.community.domain.exception;

import java.util.UUID;

public class CommunityNotFoundException extends RuntimeException {

  public CommunityNotFoundException(UUID communityId) {
    super("community not found " + communityId);
  }
}
