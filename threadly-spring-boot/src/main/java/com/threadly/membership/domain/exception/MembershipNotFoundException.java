package com.threadly.membership.domain.exception;

import com.threadly.membership.CommunityMembershipId;

public class MembershipNotFoundException extends RuntimeException {

  public MembershipNotFoundException(String message) {
    super(message);
  }

  public static MembershipNotFoundException from(CommunityMembershipId id) {
    return new MembershipNotFoundException("membership not found for " + id);
  }
}
