package com.threadly.user.application.services;

import com.threadly.common.AuthRole;
import com.threadly.user.LocalUserCreateRequest;
import com.threadly.user.UserCreateRequest;
import com.threadly.user.UserCreatedEvent;
import com.threadly.user.UserDTO;
import com.threadly.user.UserDetailDTO;
import com.threadly.user.UserExternalService;
import com.threadly.user.application.usecase.UserInternalApi;
import com.threadly.user.domain.User;
import com.threadly.user.infrastructure.persistence.UserRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
class UserService implements UserExternalService, UserInternalApi {

  private final UserRepository userRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  public Optional<UserDTO> getUserById(UUID userId) {
    return userRepository.findById(userId).map(UserMapper::toDTO);
  }

  @Override
  public Slice<UserDTO> getUsers(String query, Integer pageSize) {
    return userRepository.findByName(query, Pageable.ofSize(pageSize))
        .map(UserMapper::toDTO);
  }

  @Override
  public Optional<UserDTO> getUserByUsername(String username) {
    return userRepository.findByUserName(username).map(UserMapper::toDTO);
  }

  @Override
  public Optional<UserDTO> getUserByEmail(String email) {
    return userRepository.findByEmail(email).map(UserMapper::toDTO);
  }

  @Override
  public Optional<UserDetailDTO> getUserDetailsById(UUID userId) {
    return userRepository.findById(userId).map(UserMapper::toDetailDTO);
  }

  @Override
  public Optional<UserDetailDTO> getUserDetailsByUsername(String username) {
    return userRepository.findByUserName(username).map(UserMapper::toDetailDTO);
  }

  @Override
  public Optional<UserDetailDTO> getUserDetailsByEmail(String email) {
    return userRepository.findByEmail(email).map(UserMapper::toDetailDTO);
  }

  @Override
  public AuthRole getUserRoleById(UUID userId) {
    return getUserDetailsById(userId).map(u -> AuthRole.USER).orElse(AuthRole.PUBLIC);
  }

  @Override
  public void deleteUserById(UUID userId) {

    log.info("Deleting user with id={}", userId);

    userRepository.delete(userId);

    log.info("Deleted user with id={}", userId);
  }


  @Override
  @Transactional
  public UUID createOrGetUser(UserCreateRequest request) {
    return userRepository.findByEmail(request.email())
        .map(existing -> {
          log.info("User already exists: {}", existing.getEmail());
          return existing.getId();
        })
        .orElseGet(() -> {
          try {
            User user = User.from(request);

            user = userRepository.saveAndFlush(user);

            eventPublisher.publishEvent(new UserCreatedEvent(
                user.getId(),
                user.getUsername(),
                user.getAuthProvider()
            ));

            log.info("User created successfully: email={}, username={}", user.getEmail(),
                user.getUsername());
            return user.getId();

          } catch (DataIntegrityViolationException e) {
            // Possible race condition — another thread may have created it.
            log.warn("Concurrent user creation detected for email: {}", request.email());
            return userRepository.findByEmail(request.email())
                .map(User::getId)
                .orElseThrow(() -> e);
          } catch (Exception e) {
            log.error("Unexpected error while creating user with email={}", request.email(), e);
            throw e;
          }
        });
  }


  @Override
  @Transactional
  public UUID createUser(LocalUserCreateRequest request) {
    User user = User.from(request);
    user = userRepository.saveAndFlush(user);

    eventPublisher.publishEvent(new UserCreatedEvent(
        user.getId(),
        user.getUsername(),
        user.getAuthProvider()
    ));

    log.info("Local User created successfully: {}", user.getEmail());
    return user.getId();
  }
}
