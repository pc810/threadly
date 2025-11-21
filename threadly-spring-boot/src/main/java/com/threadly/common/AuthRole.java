package com.threadly.common;

/**
 * Represents the authentication/authorization role a user can have.
 */
public enum AuthRole {

  /**
   * The creator or owner of the community.
   * Has the highest level of permissions.
   */
  AUTHOR,

  /**
   * A user who is a member of the community.
   * Has permissions limited to membership.
   */
  MEMBER,

  /**
   * A community moderator with elevated permissions.
   * Can manage content and members depending on policy.
   */
  MOD,

  /**
   * Any authenticated (logged-in) user.
   * Not necessarily related to the community.
   */
  USER,

  /**
   * Anyone who is not logged in or is outside the community.
   */
  PUBLIC
}