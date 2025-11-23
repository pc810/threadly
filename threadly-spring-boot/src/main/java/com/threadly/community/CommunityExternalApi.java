package com.threadly.community;

import com.threadly.community.application.usecase.CanActionUseCase;
import com.threadly.community.application.usecase.CanPostInCommunityUseCase;
import com.threadly.community.application.usecase.GetCommunityRoleUseCase;

public interface CommunityExternalApi extends CanPostInCommunityUseCase, CanActionUseCase,
    GetCommunityRoleUseCase {

}
