package com.threadly.permission.application.service;

import com.threadly.common.PermissionService;
import com.threadly.community.CommunityExternalApi;
import com.threadly.post.PostExternalApi;
import org.springframework.stereotype.Service;

@Service
class PermissionServiceImpl implements PermissionService {

  private CommunityExternalApi communityExternalApi;
  private PostExternalApi postExternalApi;

}
