package com.threadly.community;

import com.threadly.community.application.usecase.CanActionUseCase;
import com.threadly.community.application.usecase.CanPostInCommunityUseCase;

public interface CommunityExternalApi extends CanPostInCommunityUseCase, CanActionUseCase {

}
