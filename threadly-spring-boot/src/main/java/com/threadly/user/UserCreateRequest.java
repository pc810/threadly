package com.threadly.user;

import com.threadly.common.AuthProvider;

public record UserCreateRequest(
    String email,
    String username,
    AuthProvider authProvider
) {

}
