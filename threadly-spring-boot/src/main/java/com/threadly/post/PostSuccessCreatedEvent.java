package com.threadly.post;

public record PostSuccessCreatedEvent(PostCreatedEvent event, java.time.Instant now) {

}
