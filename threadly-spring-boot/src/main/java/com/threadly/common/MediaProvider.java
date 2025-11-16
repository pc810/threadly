package com.threadly.common;

public enum MediaProvider {
  LOCAL, S3;

  public static MediaProvider from(String value) {
    return MediaProvider.valueOf(value.toUpperCase());
  }
}
