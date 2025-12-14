package com.threadly.community;

import java.util.Optional;

public record UpdateCommunityMetaDTO(
    Optional<String> title,
    Optional<String> description,
    Optional<Boolean> isNsfw
) {

}
