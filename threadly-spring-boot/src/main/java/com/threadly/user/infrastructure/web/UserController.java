package com.threadly.user.infrastructure.web;

import com.threadly.user.UserDTO;
import com.threadly.user.application.usecase.UserInternalApi;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
class UserController {

  private final UserInternalApi userInternalApi;

  @Operation(summary = "Get all users", description = "Fetches all registered users.")
  @GetMapping
  public ResponseEntity<List<UserDTO>> getUsers() {

    var userOpt = userInternalApi.getUserById(UUID.randomUUID());

    return userOpt.map(user -> ResponseEntity.ok(List.of(user)))
        .orElseGet(() -> ResponseEntity.ok(List.of()));
  }

  @Operation(summary = "Get user by ID", description = "Fetches a registered user by their ID.")
  @GetMapping("{id}")
  public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {

    var userOpt = userInternalApi.getUserById(id);

    return userOpt.map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}