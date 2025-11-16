package com.threadly.post.infrastructure.consumer;

import com.threadly.common.RabbitUtil;
import com.threadly.post.application.usecase.PostInternalApi;
import com.threadly.post.domain.PostMetaUpdateEvent;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostMetaUpdateEventConsumer {

  private static final Logger log = LoggerFactory.getLogger(PostMetaUpdateEventConsumer.class);
  private final PostInternalApi postInternalApi;

  @RabbitListener(queues = RabbitUtil.POST_SEO_COMPLETE_QUEUE)
  void consumePostSeoCompleteMessage(PostMetaUpdateEvent event) {
    log.info("consuming PostMetaUpdateEvent event={}", event);
    postInternalApi.updatePostMeta(event);
    log.info("completed PostMetaUpdateEvent id={}", event.id());
  }

}
