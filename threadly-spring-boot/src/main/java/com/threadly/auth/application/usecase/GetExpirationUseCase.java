package com.threadly.auth.application.usecase;

import java.time.Instant;

public interface GetExpirationUseCase {

  long getExpiration();

  Instant getExpirationDate();
}
