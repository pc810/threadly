package com.threadly.community.application.listener;

import com.threadly.common.ResourceRelation;
import com.threadly.common.ResourceType;
import com.threadly.common.SysConstant;
import com.threadly.community.CommunityCreatedEvent;
import com.threadly.community.CommunityVisibility;
import com.threadly.community.UpdateCommunityVisibilityEvent;
import com.threadly.permission.PermissionClient;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class CommunityManagement {

  private final PermissionClient permissionClient;

  @EventListener
  void handleCommunityCreated(CommunityCreatedEvent event) {

    log.info("Linking community {} to SYS ({}) with relation '{}'",
        event.id(), SysConstant.NAME, ResourceRelation.Community.SYS);
    permissionClient.addRelation(
        ResourceType.COMMUNITY,
        event.id(),
        ResourceRelation.Community.SYS,
        ResourceType.SYS,
        SysConstant.NAME
    );

    log.info("Linking community {} to User ({}) with relation '{}'",
        event.id(), event.ownerId(), ResourceRelation.Community.OWNER);
    permissionClient.addRelation(
        ResourceType.COMMUNITY,
        event.id(),
        ResourceRelation.Community.OWNER,
        ResourceType.USER,
        event.ownerId()
    );

    if (event.visibility() == CommunityVisibility.PUBLIC) {
      linkToPublicUsers(event.id());
    }
  }

  @EventListener
  void handleCommunityVisibilityChange(UpdateCommunityVisibilityEvent event) {
    if (event.currentVisibility().equals(CommunityVisibility.PUBLIC)
        && event.updatedVisibility().equals(CommunityVisibility.PRIVATE)) {
      log.info("Unlinking community {} from all public users", event.communityId());
      permissionClient.removeRelation(
          ResourceType.COMMUNITY,
          event.communityId(),
          ResourceRelation.Community.PUBLIC_USER,
          ResourceType.USER,
          "*"
      );
    } else if (
        event.currentVisibility().equals(CommunityVisibility.PRIVATE)
            && event.updatedVisibility().equals(CommunityVisibility.PUBLIC)
    ) {
      linkToPublicUsers(event.communityId());
    }
  }

  private void linkToPublicUsers(UUID communityId) {
    log.info("Linking community {} to public Users", communityId);
    permissionClient.addRelation(
        ResourceType.COMMUNITY,
        communityId,
        ResourceRelation.Community.PUBLIC_USER,
        ResourceType.USER,
        "*"
    );
  }
}
