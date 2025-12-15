package com.threadly.post.application.listener;

import com.threadly.common.ResourceRelation;
import com.threadly.common.ResourceType;
import com.threadly.permission.PermissionClient;
import com.threadly.post.PostCreatedEvent;
import com.threadly.post.PostSuccessCreatedEvent;
import com.threadly.post.domain.LinkPostCreated;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
class PostListener {

  private final RabbitTemplate rabbitTemplate;
  private final PermissionClient permissionClient;
  private final ApplicationEventPublisher eventPublisher;

  @EventListener
  public void handlePostCreated(PostCreatedEvent event) {
    log.info("Received PostCreatedEvent: postId={}, title={}, type={}",
        event.id(), event.title(), event.type());

    event.link().ifPresent(link -> {
      rabbitTemplate.convertAndSend(
          "post.events.exchange",
          "post.link.created",
          new LinkPostCreated(
              UUID.randomUUID(),
              event.id(),
              link
          )
      );
    });

    log.info("Linking Post {} to Community ({}) with relation '{}'",
        event.id(), event.communityId(), ResourceRelation.Post.COMMUNITY);
    permissionClient.addRelation(
        ResourceType.POST,
        event.id(),
        ResourceRelation.Post.COMMUNITY,
        ResourceType.COMMUNITY,
        event.communityId()
    );

    log.info("Linking Post {} to User ({}) with relation '{}'",
        event.id(), event.authorId(), ResourceRelation.Post.AUTHOR);
    permissionClient.addRelation(
        ResourceType.POST,
        event.id(),
        ResourceRelation.Post.AUTHOR,
        ResourceType.USER,
        event.authorId()
    );

    eventPublisher.publishEvent(
        new PostSuccessCreatedEvent(event,Instant.now())
    );
  }
}
