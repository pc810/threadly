package com.threadly.user;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "User Detail Detail Transfer Object")
public record UserDetailDTO(
    @Schema(description = "Unique identifier of the user") UUID id,
    @Schema(description = "Display name of the user") String name,
    @Schema(description = "Display email of the user") String email,
    @Schema(description = "Password email of the user") String password
) {}