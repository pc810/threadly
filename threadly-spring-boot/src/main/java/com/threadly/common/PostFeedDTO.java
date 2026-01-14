package com.threadly.common;

import java.time.Instant;
import java.util.UUID;

public record PostFeedDTO(
    UUID id,
    UUID postId,
    UUID userId,
    UUID communityId,
    Instant createdAt
) {

}
