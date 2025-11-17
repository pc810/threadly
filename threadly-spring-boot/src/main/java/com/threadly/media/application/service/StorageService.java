package com.threadly.media.application.service;

import com.threadly.common.MediaProvider;
import com.threadly.media.ImageMedia;
import com.threadly.media.application.usecase.IStorage;
import com.threadly.media.domain.Media;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService implements IStorage {

  @Value("${threadly.base-url}")
  private String host;

  private final MinioClient minioClient;

  public String presigned(String bucket, String object) {
    try {
      return minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.GET)
              .bucket(bucket)
              .object(object)
              .expiry(60 * 60)
              .build()
      );
    } catch (Exception e) {
      log.error("unable to presign object " + e);
      return "";
    }
  }

  @Override
  public ImageMedia getImage(Media media) {
    return new ImageMedia(
        media.getProvider().equals(MediaProvider.S3)
            ? presigned(media.getBasePath(), media.getFilename())
            : host + "public",
        media.getWidth(),
        media.getHeight()
    );
  }
}
