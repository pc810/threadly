package com.threadly.config;

import static com.threadly.common.RabbitUtil.POST_EVENTS_EXCHANGE;
import static com.threadly.common.RabbitUtil.POST_QUEUE;
import static com.threadly.common.RabbitUtil.ROUTING_KEY;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class RabbitConfig {

  @Bean
  public MessageConverter jsonMessageConverter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
      ConnectionFactory connectionFactory,
      MessageConverter jsonMessageConverter
  ) {
      SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(jsonMessageConverter);
    return factory;
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate template = new RabbitTemplate(connectionFactory);
    template.setMessageConverter(new Jackson2JsonMessageConverter());
    return template;
  }

  @Bean
  public DirectExchange postEventsExchange() {
    return new DirectExchange(POST_EVENTS_EXCHANGE
        , true, false);
  }

  @Bean
  public Queue postQueue() {
    return new Queue(POST_QUEUE, true);
  }


  @Bean
  public Binding binding(Queue postQueue, DirectExchange postEventsExchange) {
    return BindingBuilder.bind(postQueue)
        .to(postEventsExchange)
        .with(ROUTING_KEY);
  }

  @Bean
  public ApplicationRunner rabbitDebug(ConnectionFactory cf) {
    return args -> {
      log.info("RabbitMQ Connected: {}", cf.getHost());
    };
  }
}

