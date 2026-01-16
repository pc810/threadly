package com.threadly.user.application.services;

import com.threadly.user.UserDTO;
import com.threadly.user.UserDetailDTO;
import com.threadly.user.UserMetaDTO;
import com.threadly.user.domain.User;

public class UserMapper {

  public static UserDTO toDTO(User user) {
    return new UserDTO(
        user.getId(),
        user.getUsername()
    );
  }

  public static UserDetailDTO toDetailDTO(User user) {
    return new UserDetailDTO(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getPasswordHash()
    );
  }

  public static UserMetaDTO toMetaDTO(User user) {
    return new UserMetaDTO(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getAuthProvider(),
        user.getStatus()
    );
  }
}
