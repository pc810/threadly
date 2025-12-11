package com.threadly.user.application.listener;

import com.threadly.common.ResourceRelation;
import com.threadly.common.ResourceType;
import com.threadly.common.SysConstant;
import com.threadly.permission.PermissionClient;
import com.threadly.user.UserCreatedEvent;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@AllArgsConstructor
public class UserManagement {

  private final PermissionClient permissionClient;

  @EventListener
  void handleUserCreatedEvent(UserCreatedEvent event) {

    log.info("handleUserCreatedEvent event={}", event);

    permissionClient.addRelation(
        ResourceType.SYS,
        SysConstant.NAME,
        ResourceRelation.Sys.REGULAR_USER,
        ResourceType.USER,
        event.id()
    );
  }
}
