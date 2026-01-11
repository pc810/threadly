package com.threadly.media.application.usecase;

import com.threadly.media.ImageMedia;
import com.threadly.media.domain.Media;
import java.time.Duration;

public interface IStorage {

  ImageMedia getImage(Media media);

  String presignPut(
      String bucket,
      String objectKey,
      String contentType,
      Duration expiry
  );

  void copyObject(
      String srcBucket,
      String srcObjectKey,
      String destBucket,
      String destObjectKey
  );

  void deleteObject(
      String bucket,
      String objectKey
  );
}
