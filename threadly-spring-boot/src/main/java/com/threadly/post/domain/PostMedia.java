package com.threadly.post.domain;


import com.threadly.common.MediaDimension;

public record PostMedia(
    String basePath,
    String provider,
    String filename,
    String contentType,
    MediaDimension dimension
) {

}
