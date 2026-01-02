package com.threadly.community;


import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateCommunityMetaDTO(
    String title,
    String description,
    Boolean isNsfw
) {

}
