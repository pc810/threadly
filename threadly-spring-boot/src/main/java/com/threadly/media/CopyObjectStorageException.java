package com.threadly.media;

import io.minio.CopyObjectArgs;

public class CopyObjectStorageException extends StorageException {

  final ObjectBucketKey source;
  final ObjectBucketKey dest;

  public CopyObjectStorageException(ObjectBucketKey source, ObjectBucketKey dest, Throwable cause) {
    super(cause);
    this.source = source;
    this.dest = dest;
  }


  public static CopyObjectStorageException from(ObjectBucketKey source, ObjectBucketKey dest,
      Throwable cause) {
    return new CopyObjectStorageException(source, dest, cause);
  }

  public static CopyObjectStorageException from(CopyObjectArgs args, Throwable cause) {
    return new CopyObjectStorageException(ObjectBucketKey.from(
        args.source().object(), args.source().bucket()
    ), ObjectBucketKey.from(args.bucket(), args.object()), cause);
  }

  @Override
  public String toString() {
    return "CopyObjectStorageException{" +
        "source=" + source +
        ", dest=" + dest +
        '}';
  }
}
