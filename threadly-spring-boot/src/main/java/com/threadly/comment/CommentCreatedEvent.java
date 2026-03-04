package com.threadly.comment;

import java.util.UUID;

public record CommentCreatedEvent(
    UUID id,
    UUID communityId,
    UUID postId
) {

}
