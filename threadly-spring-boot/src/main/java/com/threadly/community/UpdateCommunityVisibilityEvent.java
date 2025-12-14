package com.threadly.community;

import java.util.UUID;

public record UpdateCommunityVisibilityEvent(UUID communityId,
                                             CommunityVisibility currentVisibility,
                                             CommunityVisibility updatedVisibility) {

}
