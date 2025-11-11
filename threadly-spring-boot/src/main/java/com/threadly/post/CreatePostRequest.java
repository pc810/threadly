package com.threadly.post;

import java.util.Map;
import java.util.UUID;

public record CreatePostRequest(
    String title,
    PostType type,
    Map<String, Object> contentJson,
    String contentHtml,
    String contentText,
    String link,
    UUID communityId
) {

}
