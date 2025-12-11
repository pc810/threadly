package com.threadly.community.application.listener;

import com.threadly.common.ResourceRelation;
import com.threadly.common.ResourceType;
import com.threadly.common.SysConstant;
import com.threadly.community.CommunityCreatedEvent;
import com.threadly.permission.PermissionClient;
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
  }
}
