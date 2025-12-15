package com.threadly.feed.application;

import com.threadly.feed.application.usecase.PostFeedInternalApi;
import com.threadly.membership.MembershipExternalApi;
import com.threadly.permission.PermissionClient;
import com.threadly.post.PostSuccessCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
class PostFeedManagement {

  private final MembershipExternalApi membershipExternalApi;
  private final PermissionClient permissionClient;
  private final PostFeedInternalApi postFeedInternalApi;

  @EventListener
  public void handlePostSuccessCreatedEvent(PostSuccessCreatedEvent postSuccessCreatedEvent) {
    var event = postSuccessCreatedEvent.event();
    log.info("PostFeedManagement PostSuccessCreatedEvent {}", postSuccessCreatedEvent);

    var communityId = event.communityId();

    var communityMembers = membershipExternalApi.getMembers(communityId);

    communityMembers.stream()
//        .filter(
//            membership -> permissionClient.checkPermissionWithConsistency(ResourceType.POST,
//                event.id(),
//                Post.VIEW, ResourceType.USER, membership.getId().userId(), Consistency.newBuilder()
//                    .setFullyConsistent(true)
//                    .build())
//        )
        .map(membership -> membership.getId().userId())
        .forEach((userId) -> postFeedInternalApi.createPostFeed(event.id(), userId));
  }
}
