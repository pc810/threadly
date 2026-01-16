package com.threadly.user;

import com.threadly.common.AuthProvider;
import com.threadly.user.domain.User.AccountStatus;
import java.util.UUID;

public record UserMetaDTO(
    UUID id,
    String username,
    String email,
    AuthProvider authProvider,
    AccountStatus status
) {

}
