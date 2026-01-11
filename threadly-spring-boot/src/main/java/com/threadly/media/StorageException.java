package com.threadly.media;

public class StorageException extends RuntimeException {

  StorageException(String message) {
    super(message);
  }

  public StorageException(Throwable cause) {
    super(cause);
  }
}


