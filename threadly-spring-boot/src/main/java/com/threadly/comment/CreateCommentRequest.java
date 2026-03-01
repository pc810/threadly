package com.threadly.comment;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public record CreateCommentRequest(
    Map<String, Object> contentJson,
    String contentHtml,
    String contentText,
    UUID postId,
    UUID communityId,
    UUID actorId,
    Integer depth,
    UUID parentId
) {

}
