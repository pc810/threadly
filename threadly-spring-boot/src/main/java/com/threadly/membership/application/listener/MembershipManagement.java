package com.threadly.membership.application.listener;


import com.threadly.common.ResourceRelation;
import com.threadly.common.ResourceType;
import com.threadly.membership.CommunityMembershipCreatedEvent;
import com.threadly.membership.CommunityMembershipRemovedEvent;
import com.threadly.membership.CommunityRole;
import com.threadly.permission.PermissionClient;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class MembershipManagement {

  private final PermissionClient permissionClient;

  @EventListener
  public void handleCommunityMembershipCreated(CommunityMembershipCreatedEvent event) {
    permissionClient.addRelation(
        ResourceType.COMMUNITY,
        event.communityId(),
        event.role().isAuthor() ? ResourceRelation.Community.OWNER : ResourceRelation.Community.MEMBER,
        ResourceType.USER,
        event.userId()
    );
  }

  @EventListener
  public void handleCommunityMembershipRemoved(CommunityMembershipRemovedEvent event) {
    permissionClient.removeRelation(
        ResourceType.COMMUNITY,
        event.communityMemberId().communityId(),
        event.role().isAuthor() ? ResourceRelation.Community.OWNER : ResourceRelation.Community.MEMBER,
        ResourceType.USER,
        event.communityMemberId().userId()
    );
  }
}
