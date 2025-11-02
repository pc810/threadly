package com.threadly.auth.domain;

public record RegisterUserRequest(
    String email,
    String password
) {

}
