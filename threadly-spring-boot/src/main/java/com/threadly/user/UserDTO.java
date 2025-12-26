package com.threadly.user;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "User data transfer object")
public record UserDTO(
    @Schema(description = "Unique identifier of the user") UUID id,
    @Schema(description = "Display name of the user") String name
) {

}