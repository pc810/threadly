package com.threadly.media;

import com.threadly.common.MediaDimension;
import java.util.UUID;

public record CreateMediaEvent(
    UUID postId,
    String basePath,
    String provider,
    String filename,
    String contentType,
    MediaDimension dimension
) {

}
