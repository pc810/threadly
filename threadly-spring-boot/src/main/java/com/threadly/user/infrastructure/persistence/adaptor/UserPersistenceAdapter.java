package com.threadly.user.infrastructure.persistence.adaptor;


import com.threadly.user.domain.User;
import com.threadly.user.infrastructure.persistence.UserRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class UserPersistenceAdapter implements UserRepository {

  private final JpaUserRepository userRepository;

  @Override
  public Optional<User> findById(UUID id) {
    return userRepository.findById(id);
  }

  @Override
  public Optional<User> findByUserName(String username) {
    return userRepository.findByUsername(username);
  }

  @Override
  public void save(User user) {
    userRepository.save(user);
  }

  @Override
  public User saveAndFlush(User user) {
    return userRepository.saveAndFlush(user);
  }

  @Override
  public void delete(UUID id) {
    userRepository.deleteById(id);
  }

  @Override
  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }
}
