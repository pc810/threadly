package com.threadly.post;

public record CreatePostRequest(
    String title,
    PostType type,
    String contentJson,
    String contentHtml,
    String contentText,
    String link
) {

}
