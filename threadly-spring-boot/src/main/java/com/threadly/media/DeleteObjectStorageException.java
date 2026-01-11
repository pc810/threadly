package com.threadly.media;

import io.minio.RemoveObjectArgs;

public class DeleteObjectStorageException extends StorageException {

  final ObjectBucketKey key;

  public DeleteObjectStorageException(ObjectBucketKey key, Throwable cause) {
    super(cause);
    this.key = key;
  }


  public static DeleteObjectStorageException from(ObjectBucketKey key,
      Throwable cause) {
    return new DeleteObjectStorageException(key, cause);
  }

  public static DeleteObjectStorageException from(RemoveObjectArgs args,
      Throwable cause) {
    return new DeleteObjectStorageException(ObjectBucketKey
        .from(args.bucket(), args.bucket()), cause);
  }

  @Override
  public String toString() {
    return "DeleteObjectStorageException{" +
        "key=" + key +
        '}';
  }
}
