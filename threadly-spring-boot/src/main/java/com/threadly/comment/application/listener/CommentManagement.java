package com.threadly.comment.application.listener;

import com.threadly.comment.CommentCreatedEvent;
import com.threadly.common.ResourceRelation;
import com.threadly.common.ResourceRelation.Comment;
import com.threadly.common.ResourceType;
import com.threadly.permission.PermissionClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommentManagement {

  private final PermissionClient permissionClient;

  @EventListener
  public void handleCommentCreated(CommentCreatedEvent event) {

    log.info("Linking comment {} to POST ({}) with relation '{}'", event.id(), event.postId(),
        Comment.POST);

    permissionClient.addRelation(
        ResourceType.COMMENT,
        event.id(),
        ResourceRelation.Comment.POST,
        ResourceType.POST,
        event.postId()
    );
  }
}
