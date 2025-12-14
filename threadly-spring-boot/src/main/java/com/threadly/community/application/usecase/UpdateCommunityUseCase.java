package com.threadly.community.application.usecase;

import com.threadly.community.CommunityVisibility;
import com.threadly.community.UpdateCommunityMetaDTO;
import java.util.UUID;

public interface UpdateCommunityUseCase {

  void changeVisibility(UUID communityId, CommunityVisibility visibility);

  void updateCommunityMeta(UUID communityId, UpdateCommunityMetaDTO updateCommunityMetaDTO);
}
