package com.threadly.post.domain;

import java.io.Serializable;
import java.util.UUID;

public record LinkPostCreated(UUID id, UUID postId, String link) implements Serializable {

}
