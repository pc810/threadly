package com.threadly.user;

import com.threadly.user.application.usercase.CreateUserUseCase;
import com.threadly.user.application.usercase.GetUserUseCase;

public interface UserExternalService extends GetUserUseCase, CreateUserUseCase {

}
