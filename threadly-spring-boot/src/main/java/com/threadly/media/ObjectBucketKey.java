package com.threadly.media;

public record ObjectBucketKey(String bukcet, String objectKey) {

  public static ObjectBucketKey from(String bukcet, String objectKey) {
    return new ObjectBucketKey(bukcet, objectKey);
  }
}
