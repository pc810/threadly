package com.threadly.user;

import com.threadly.common.AuthProvider;

public record LocalUserCreateRequest(
    String email,
    String passwordHash,
    AuthProvider authProvider,
    String providerId
) {

}
