package com.threadly.post.application.listener;

import static com.threadly.common.RabbitUtil.POST_QUEUE;

import com.threadly.post.PostCreatedEvent;
import com.threadly.post.domain.LinkPostCreated;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
class PostListener {

  private final RabbitTemplate rabbitTemplate;

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
  }
}
