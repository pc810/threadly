package com.threadly.user;

import com.threadly.user.application.usecase.CreateUserUseCase;
import com.threadly.user.application.usecase.GetUserUseCase;

public interface UserExternalService extends GetUserUseCase, CreateUserUseCase {

}
