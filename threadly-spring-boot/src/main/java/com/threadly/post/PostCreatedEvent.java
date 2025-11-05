package com.threadly.post;

import java.util.UUID;

public record PostCreatedEvent(UUID id,
                               String title, PostType type) {

}
