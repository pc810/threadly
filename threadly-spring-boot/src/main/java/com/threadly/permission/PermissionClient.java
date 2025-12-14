package com.threadly.permission;

import com.threadly.common.RelationType;
import com.threadly.common.ResourcePermissionType;
import com.threadly.common.ResourceType;
import java.util.Set;

public interface PermissionClient {

  void applySchema();

  String addRelation(String resourceType, Object resourceId, String relation, String subjectType,
      Object subjectId);

  String addRelation(
      ResourceType resourceType,
      Object resourceId,
      RelationType relation,
      ResourceType subjectType,
      Object subjectId);

  String removeRelation(
      ResourceType resourceType,
      Object resourceId,
      RelationType relation,
      ResourceType subjectType,
      Object subjectId);



  boolean checkPermission(ResourceType resourceType, Object resourceId,
      ResourcePermissionType permission,
      ResourceType subjectType, Object subjectId);

  boolean checkPermission(String resourceType, Object resourceId, String permission,
      String subjectType, Object subjectId);

  Set<String> lookupResources(
      ResourceType resourceType,
      ResourcePermissionType permission,
      ResourceType subjectType,
      Object subjectId
  );

}
