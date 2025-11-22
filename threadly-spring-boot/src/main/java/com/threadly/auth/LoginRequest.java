package com.threadly.auth;

public record LoginRequest(
    String email,
    String password
) {

}
