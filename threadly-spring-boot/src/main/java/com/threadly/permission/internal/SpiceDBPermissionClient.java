package com.threadly.permission.internal;

import com.authzed.api.v1.CheckPermissionRequest;
import com.authzed.api.v1.CheckPermissionResponse.Permissionship;
import com.authzed.api.v1.Consistency;
import com.authzed.api.v1.LookupResourcesRequest;
import com.authzed.api.v1.ObjectReference;
import com.authzed.api.v1.PermissionsServiceGrpc;
import com.authzed.api.v1.Relationship;
import com.authzed.api.v1.RelationshipUpdate;
import com.authzed.api.v1.RelationshipUpdate.Operation;
import com.authzed.api.v1.SchemaServiceGrpc;
import com.authzed.api.v1.SubjectReference;
import com.authzed.api.v1.WriteRelationshipsRequest;
import com.authzed.api.v1.WriteRelationshipsResponse;
import com.authzed.api.v1.WriteSchemaRequest;
import com.authzed.api.v1.WriteSchemaResponse;
import com.authzed.grpcutil.BearerToken;
import com.threadly.common.PermissionTypeRegistry;
import com.threadly.common.RelationType;
import com.threadly.common.ResourcePermissionType;
import com.threadly.common.ResourceType;
import com.threadly.config.SpiceDBProperties;
import com.threadly.permission.PermissionClient;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

@Slf4j
@Component
class SpiceDBPermissionClient implements PermissionClient {

  private final ManagedChannel channel;
  private final SchemaServiceGrpc.SchemaServiceBlockingStub schemaService;
  private final PermissionsServiceGrpc.PermissionsServiceBlockingStub permissionsService;

  SpiceDBPermissionClient(SpiceDBProperties spiceDBProperties) {
    this.channel = ManagedChannelBuilder
        .forTarget(spiceDBProperties.host())
        .usePlaintext()
        .build();

    BearerToken bearerToken = new BearerToken(spiceDBProperties.token());
    this.schemaService = SchemaServiceGrpc.newBlockingStub(channel)
        .withCallCredentials(bearerToken);
    this.permissionsService = PermissionsServiceGrpc
        .newBlockingStub(channel)
        .withCallCredentials(bearerToken);

//    applySchema();
  }

  @PostConstruct
  public void init() {
    applySchema();
  }

  @Override
  public void applySchema() {
    log.info("Writing schema...");
    String schema = loadSchema();
    WriteSchemaRequest request = WriteSchemaRequest
        .newBuilder()
        .setSchema(schema)
        .build();
    WriteSchemaResponse response;
    try {
      response = schemaService.writeSchema(request);
      log.info("Successfully write schema");
      log.info("Response: " + response.toString());
    } catch (Exception e) {
      log.error("RPC failed: {0}", e);
    }
  }

  @Override
  public String addRelation(String resourceType, Object resourceId, String relation,
      String subjectType, Object subjectId) {
    return "";
  }

  @Override
  public String addRelation(ResourceType resourceType, Object resourceId, RelationType relation,
      ResourceType subjectType, Object subjectId) {
    log.info(
        "addRelation: resourceType={}, resourceId={}, relation={}, subjectType={}, subjectId={}",
        resourceType,
        resourceId,
        relation,
        subjectType,
        subjectId);

    return writeRelation(resourceType, resourceId, relation, subjectType, subjectId,
        Operation.OPERATION_CREATE);
  }

  @NotNull
  private String writeRelation(ResourceType resourceType, Object resourceId, RelationType relation,
      ResourceType subjectType, Object subjectId, Operation operation) {
    var request = WriteRelationshipsRequest
        .newBuilder()
        .addUpdates(
            RelationshipUpdate.newBuilder()
                .setOperation(operation)
                .setRelationship(
                    Relationship.newBuilder()
                        .setResource(
                            ObjectReference.newBuilder()
                                .setObjectType(resourceType.value())
                                .setObjectId(resourceId.toString())
                                .build()
                        )
                        .setRelation(relation.value())
                        .setSubject(
                            SubjectReference.newBuilder()
                                .setObject(
                                    ObjectReference.newBuilder()
                                        .setObjectType(subjectType.value())
                                        .setObjectId(subjectId.toString())
                                        .build()
                                )
                                .build()
                        )
                        .build()
                )
                .build()
        )
        .build();

    WriteRelationshipsResponse response;
    try {
      response = permissionsService.writeRelationships(request);
    } catch (Exception e) {
      log.error("RPC failed: {}", e.getMessage());
      return "";
    }
    log.info("Response: " + response.toString());
    return response.getWrittenAt().getToken();
  }

  @Override
  public String removeRelation(ResourceType resourceType, Object resourceId, RelationType relation,
      ResourceType subjectType, Object subjectId) {
    log.info(
        "removeRelation: resourceType={}, resourceId={}, relation={}, subjectType={}, subjectId={}",
        resourceType,
        resourceId,
        relation,
        subjectType,
        subjectId);

    return writeRelation(resourceType, resourceId, relation, subjectType, subjectId,
        Operation.OPERATION_DELETE);
  }

  @Override
  public boolean checkPermission(ResourceType resourceType, Object resourceId,
      ResourcePermissionType permission, ResourceType subjectType, Object subjectId) {
    var checkRequest = CheckPermissionRequest.newBuilder()
        .setConsistency(
            Consistency.newBuilder()
                .setMinimizeLatency(true)
                .build()
        )
        .setResource(
            ObjectReference.newBuilder()
                .setObjectType(resourceType.value())
                .setObjectId(resourceId.toString())
                .build()
        )
        .setPermission(permission.toString().toLowerCase())
        .setSubject(
            SubjectReference.newBuilder()
                .setObject(
                    ObjectReference.newBuilder()
                        .setObjectType(subjectType.value())
                        .setObjectId(subjectId.toString())
                        .build()
                )
                .build()
        )
        .build();
    log.info("checkPermissionRequest={}", checkRequest);
    try {
      var response = permissionsService.checkPermission(checkRequest);
      log.info("CheckPermissionResponse={}",
          response.getPermissionship().getValueDescriptor().getName());
      return response.getPermissionship() == Permissionship.PERMISSIONSHIP_HAS_PERMISSION;
    } catch (Exception e) {
      log.error("Failed to check permission: {}", e.getMessage());
    }
    return false;
  }

  @Override
  public boolean checkPermission(String resourceType, Object resourceId, String permission,
      String subjectType, Object subjectId) {
    return checkPermission(
        ResourceType.valueOf(resourceType),
        resourceId,
        PermissionTypeRegistry.fromString(permission),
        ResourceType.valueOf(subjectType),
        subjectId
    );
  }

  @Override
  public Set<String> lookupResources(ResourceType resourceType, ResourcePermissionType permission,
      ResourceType subjectType, Object subjectId) {
    var request = LookupResourcesRequest.newBuilder()
        .setConsistency(Consistency.newBuilder().setMinimizeLatency(true).build())
        .setResourceObjectType(resourceType.value())
        .setPermission(permission.value().toLowerCase())
        .setSubject(SubjectReference.newBuilder()
            .setObject(
                ObjectReference.newBuilder()
                    .setObjectType(subjectType.value())
                    .setObjectId(subjectId.toString())
                    .build()
            )
            .build())
        .build();
    final Set<String> resources = new HashSet<>();
    var responseIterator = permissionsService.lookupResources(request);
    while (responseIterator.hasNext()) {
      resources.add(responseIterator.next().getResourceObjectId());
    }

    return resources;
  }

  private String loadSchema() {
    try (
        InputStream in = getClass()
            .getClassLoader()
            .getResourceAsStream("spicedb/schema.zed")
    ) {
      if (in == null) {
        throw new IllegalStateException("Schema file not found in resources/spicedb/");
      }

      return new String(in.readAllBytes());

    } catch (IOException ex) {
      throw new RuntimeException("Failed to read schema.zed", ex);
    }
  }
}
