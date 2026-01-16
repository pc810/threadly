package com.threadly.user.application.usecase;

import com.threadly.common.AuthRole;
import com.threadly.user.UserDTO;
import com.threadly.user.UserDetailDTO;
import com.threadly.user.UserMetaDTO;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.RequestParam;

public interface GetUserUseCase {

  Optional<UserDTO> getUserById(UUID userId);

  Slice<UserDTO> getUsers(String query, Integer pageSize);

  Optional<UserDTO> getUserByUsername(String username);

  Optional<UserDTO> getUserByEmail(String email);

  Optional<UserDetailDTO> getUserDetailsById(UUID userId);

  Optional<UserDetailDTO> getUserDetailsByUsername(String username);

  Optional<UserDetailDTO> getUserDetailsByEmail(String email);

  AuthRole getUserRoleById(UUID userId);

  Optional<UserMetaDTO> getUserMetaById(UUID id);
}
