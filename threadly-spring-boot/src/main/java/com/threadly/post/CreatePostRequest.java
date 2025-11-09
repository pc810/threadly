package com.threadly.post;

import java.util.Objects;
import java.util.UUID;

public record CreatePostRequest(
    String title,
    PostType type,
    Object contentJson,
    String contentHtml,
    String contentText,
    String link,
    UUID communityId
) {

}
