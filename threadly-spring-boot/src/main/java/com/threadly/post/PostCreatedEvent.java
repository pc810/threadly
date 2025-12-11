package com.threadly.post;

import java.util.Optional;
import java.util.UUID;

public record PostCreatedEvent(UUID id,
                               UUID communityId,
                               UUID authorId,
                               String title,
                               PostType type,
                               Optional<String> link) {

}
