package com.threadly.community;

public record CreateCommunityRequest(
    String name,
    String title,
    String description,
    CommunityVisibility visibility,
    CommunityTopic topic,
    boolean isNsfw
) {

}
