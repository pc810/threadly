package com.threadly.community.application.usecase;

import com.threadly.membership.CommunityRole;
import java.util.Optional;
import java.util.UUID;

public interface GetCommunityRoleUseCase {

  Optional<CommunityRole> getRole(UUID communityId, UUID actorId);

}
