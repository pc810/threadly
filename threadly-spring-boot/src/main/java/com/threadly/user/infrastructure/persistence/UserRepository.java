package com.threadly.user.infrastructure.persistence;

import com.threadly.user.domain.User;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

  Optional<User> findById(UUID id);

  Optional<User> findByUserName(String username);

  void save(User user);

  User saveAndFlush(User user);

  void delete(UUID id);

  Optional<User> findByEmail(String email);
}
