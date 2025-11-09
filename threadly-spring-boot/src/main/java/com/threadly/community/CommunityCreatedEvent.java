package com.threadly.community;

import java.util.UUID;

public record CommunityCreatedEvent(UUID id, String title, UUID ownerId) {

}
