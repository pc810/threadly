package com.threadly.user;

import com.threadly.common.AuthProvider;
import java.util.UUID;

public record UserCreatedEvent(
    UUID id,
    String username,
    AuthProvider provider
) {
}
