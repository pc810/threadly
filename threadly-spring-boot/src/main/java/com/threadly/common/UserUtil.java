package com.threadly.common;

public class UserUtil {

  public static String getUsername(String email) {
    if (email == null || !email.contains("@")) {
      return "";
    }

    String localPart = email.substring(0, email.indexOf('@'));

    return localPart.replaceAll("[^a-zA-Z0-9]", "");
  }

}
