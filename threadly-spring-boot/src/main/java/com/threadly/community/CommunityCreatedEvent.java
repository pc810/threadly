package com.threadly.community;

import java.util.UUID;

public record CommunityCreatedEvent(UUID id, String title, CommunityVisibility visibility,
                                    UUID ownerId) {

}
