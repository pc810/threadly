package com.threadly.auth.application.service;

import com.threadly.auth.application.usecase.LoginUserUseCase;
import com.threadly.auth.application.usecase.RegisterUserUseCase;

public interface AuthInternalApi extends RegisterUserUseCase, LoginUserUseCase {
  
}
