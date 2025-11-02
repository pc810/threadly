package com.threadly.common;

import com.threadly.user.domain.User;
import java.util.UUID;

public record UserSignedUpEvent(
    UUID id,
    String name,
    String username,
    AuthProvider authProvider
) {

}
