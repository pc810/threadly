package com.threadly.user.application.usercase;

import com.threadly.user.UserDTO;
import com.threadly.user.UserDetailDTO;
import java.util.Optional;
import java.util.UUID;

public interface GetUserUseCase {

  Optional<UserDTO> getUserById(UUID userId);

  Optional<UserDTO> getUserByUsername(String username);

  Optional<UserDTO> getUserByEmail(String email);

  Optional<UserDetailDTO> getUserDetailsById(UUID userId);

  Optional<UserDetailDTO> getUserDetailsByUsername(String username);

  Optional<UserDetailDTO> getUserDetailsByEmail(String email);
}
