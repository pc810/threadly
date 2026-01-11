package com.threadly.media.application.service;

import com.threadly.common.MediaProvider;
import com.threadly.media.CopyObjectStorageException;
import com.threadly.media.DeleteObjectStorageException;
import com.threadly.media.ImageMedia;
import com.threadly.media.application.usecase.IStorage;
import com.threadly.media.domain.Media;
import io.minio.CopyObjectArgs;
import io.minio.CopySource;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService implements IStorage {

  private final MinioClient minioClient;
  @Value("${threadly.base-url}")
  private String host;

  public String presigned(String bucket, String object) {
    try {
      return minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder().method(Method.GET).bucket(bucket).object(object)
              .expiry(60 * 60).build());
    } catch (Exception e) {
      log.error("unable to presign object " + e);
      return "";
    }
  }

  @Override
  public ImageMedia getImage(Media media) {
    return new ImageMedia(
        media.getProvider().equals(MediaProvider.S3) ? presigned(media.getBasePath(),
            media.getFilename()) : host + "public", media.getWidth(), media.getHeight());
  }

  @Override
  public String presignPut(String bucket, String objectKey, String contentType, Duration expiry) {
    var putRequestArgs = GetPresignedObjectUrlArgs.builder().method(Method.PUT).bucket(bucket)
        .object(objectKey).expiry(Math.toIntExact(expiry.getSeconds()), TimeUnit.SECONDS)
        .extraQueryParams(Map.of("Content-Type", contentType)).build();
    try {
      return minioClient.getPresignedObjectUrl(putRequestArgs);
    } catch (Exception e) {
      log.error("failed to put", e);
      throw new IllegalStateException("Failed to generate presigned PUT URL", e);
    }
  }

  @Override
  public void copyObject(String srcBucket, String srcObjectKey, String destBucket,
      String destObjectKey) {
    var copyArgs = CopyObjectArgs.builder().bucket(destBucket).object(destObjectKey)
        .source(CopySource.builder().bucket(srcBucket).object(srcObjectKey).build()).build();
    try {
      minioClient.copyObject(copyArgs);
    } catch (Exception e) {
      var error = CopyObjectStorageException.from(copyArgs, e);
      log.error(String.valueOf(error));
      throw error;
    }
  }

  @Override
  public void deleteObject(String bucket, String objectKey) {
    var args = RemoveObjectArgs.builder().bucket(bucket).object(objectKey).build();
    try {
      minioClient.removeObject(args);
    } catch (Exception e) {
      var error = DeleteObjectStorageException.from(args, e);
      log.error(String.valueOf(error));
      throw error;
    }
  }
}
