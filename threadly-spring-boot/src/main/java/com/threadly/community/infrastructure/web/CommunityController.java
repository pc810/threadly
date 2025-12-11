package com.threadly.community.infrastructure.web;

import com.threadly.common.UserPrincipal;
import com.threadly.community.CreateCommunityRequest;
import com.threadly.community.application.usecase.CommunityInternalApi;
import com.threadly.community.domain.Community;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/communities")
@AllArgsConstructor
@Slf4j
public class CommunityController {

  private final CommunityInternalApi communityInternalApi;

  @Operation(
      summary = "Create a new community",
      description = "Creates a new community owned by the authenticated user"
  )
  @PostMapping
  ResponseEntity<Void> createCommunity(
      @Valid @RequestBody CreateCommunityRequest request,
      @AuthenticationPrincipal UserPrincipal principal
  ) {
    log.info("creating community={} principal={}", request, principal);

    var communityId = communityInternalApi.createCommunity(request, principal.userId());

    log.info("created community id={}", communityId);

    var location = URI.create("/communities/" + communityId);

    return ResponseEntity.created(location).build();
  }

  @Operation(
      summary = "Get all communities",
      description = "Retrieves a list of all existing communities."
  )
  @GetMapping
  ResponseEntity<List<Community>> getAllCommunities() {
    return ResponseEntity.ok(communityInternalApi.getAllCommunity());
  }

  @Operation(
      summary = "Get all communities viewed by user",
      description = "Retrieves a list of all communities user can view"
  )
  @GetMapping("me")
  ResponseEntity<List<Community>> getUsersCommunities(
      @AuthenticationPrincipal UserPrincipal principal
  ) {
    return ResponseEntity.ok(communityInternalApi.getAllCommunityByUser(principal.userId()));
  }

  @Operation(
      summary = "Get a community by ID",
      description = "Fetches detailed information about a specific community using its unique identifier."
  )
//  @Permissions({
//      PermissionKey.COMMUNITY_VIEW,
//  })
  @GetMapping("{id}")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'VIEW')")
  ResponseEntity<Community> getCommunity(
      @PathVariable UUID id,
      @AuthenticationPrincipal UserPrincipal principal
  ) {

    return communityInternalApi
        .getCommunity(id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }


  @Operation(
      summary = "Get a community by ID",
      description = "Fetches detailed information about a specific community using its unique identifier."
  )
  @GetMapping("name/{communityName}")
  ResponseEntity<Community> getCommunity(
      @PathVariable String communityName
  ) {
    return communityInternalApi
        .getCommunityByName(communityName)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
