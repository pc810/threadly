package com.threadly.community.infrastructure.web;

import com.threadly.common.UserPrincipal;
import com.threadly.community.CreateCommunityRequest;
import com.threadly.community.InviteUserDTO;
import com.threadly.community.UpdateCommunityMetaDTO;
import com.threadly.community.application.usecase.CommunityInternalApi;
import com.threadly.community.domain.Community;
import com.threadly.community.domain.CommunityMembershipAction;
import com.threadly.membership.CommunityMembershipDTO;
import com.threadly.membership.CommunityMembershipInviteDTO;
import com.threadly.permission.PermissionClient;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/communities")
@AllArgsConstructor
@Slf4j
public class CommunityController {

  private final CommunityInternalApi communityInternalApi;
  private final PermissionClient permissionClient;

  @Operation(summary = "Create a new community", description = "Creates a new community owned by the authenticated user")
  @PostMapping
  ResponseEntity<Void> createCommunity(@Valid @RequestBody CreateCommunityRequest request,
      @AuthenticationPrincipal UserPrincipal principal) {
    log.info("creating community={} principal={}", request, principal);

    var communityId = communityInternalApi.createCommunity(request, principal.userId());

    log.info("created community id={}", communityId);

    var location = URI.create("/communities/" + communityId);

    return ResponseEntity.created(location).build();
  }

  @Operation(summary = "Get all communities", description = "Retrieves a list of all existing communities.")
  @GetMapping
  ResponseEntity<List<Community>> getAllCommunities() {
    return ResponseEntity.ok(communityInternalApi.getAllCommunity());
  }

  @Operation(summary = "Get all communities viewed by user", description = "Retrieves a list of all communities user can view")
  @GetMapping("me")
  ResponseEntity<List<Community>> getUsersCommunities(
      @AuthenticationPrincipal UserPrincipal principal) {
    return ResponseEntity.ok(communityInternalApi.getAllCommunityByUser(principal.userId()));
  }

  @Operation(summary = "Get a community by ID", description = "Fetches detailed information about a specific community using its unique identifier.")
//  @Permissions({
//      PermissionKey.COMMUNITY_VIEW,
//  })
  @GetMapping("{id}")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'VIEW')")
  ResponseEntity<Community> getCommunity(@PathVariable UUID id,
      @AuthenticationPrincipal UserPrincipal principal) {

    return communityInternalApi.getCommunity(id).map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PatchMapping("{id}")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'UPDATE')")
  ResponseEntity<Void> updateCommunity(@PathVariable UUID id,
      @RequestBody UpdateCommunityMetaDTO updateCommunityMetaDTO) {
    communityInternalApi.updateCommunityMeta(id, updateCommunityMetaDTO);
    return ResponseEntity.ok().build();
  }


  @PostMapping("{id}/follow")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'CAN_FOLLOW')")
  ResponseEntity<Void> followCommunity(@PathVariable UUID id,
      @AuthenticationPrincipal UserPrincipal principal) {

    communityInternalApi.follow(id, principal.userId());
    return ResponseEntity.noContent().build();
  }

  @PostMapping("{id}/unfollow")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'CAN_UNFOLLOW')")
  ResponseEntity<Void> unfollowCommunity(@PathVariable UUID id,
      @AuthenticationPrincipal UserPrincipal principal) {
    communityInternalApi.unFollow(id, principal.userId());
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "Get a community by ID", description = "Fetches detailed information about a specific community using its unique identifier.")
  @GetMapping("name/{communityName}")
  ResponseEntity<Community> getCommunity(@PathVariable String communityName) {
    return communityInternalApi.getCommunityByName(communityName).map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping("{id}/members")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'VIEW')")
  ResponseEntity<Slice<CommunityMembershipDTO>> getCommunityMembers(@PathVariable UUID id,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(required = false) String role) {
    return ResponseEntity.ok(communityInternalApi.getCommunityMemberships(id,
        PageRequest.of(pageNumber, 1, Sort.by(Sort.Direction.DESC, "createdAt")),
        Optional.ofNullable(role)));
  }

  @GetMapping("{id}/invites")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'UPDATE')")
  ResponseEntity<Slice<CommunityMembershipInviteDTO>> getCommunityInvites(@PathVariable UUID id,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(required = false) String role) {
    return ResponseEntity.ok(communityInternalApi.getCommunityMembershipInvites(id,
        PageRequest.of(pageNumber, 1, Sort.by(Sort.Direction.DESC, "createdAt")),
        Optional.ofNullable(role)));
  }


  @GetMapping("{id}/invite")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'VIEW')")
  ResponseEntity<Optional<CommunityMembershipInviteDTO>> getUserInvite(@PathVariable UUID id,
      @AuthenticationPrincipal UserPrincipal principal) {
    return ResponseEntity.ok(communityInternalApi.getUserMembershipInvite(id, principal.userId()));
  }

  @PostMapping("{id}/invite")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'CAN_INVITE')")
  ResponseEntity<Void> inviteUser(@PathVariable UUID id, @RequestBody InviteUserDTO inviteUserDTO,
      @AuthenticationPrincipal UserPrincipal principal) {
//    if (!communityInternalApi.checkCanInviteModUser(id, principal.userId())) {
//      throw InsufficientPermissionException.fromResourceToSubject(
//          ResourceType.COMMUNITY,
//          ResourcePermission.Community.CAN_INVITE,
//          ResourceType.USER
//      );
//    }

    if (inviteUserDTO.role().isMod()) {
      communityInternalApi.inviteModUser(id, inviteUserDTO.userId(), principal.userId());
    } else {
      throw new UnsupportedOperationException("This feature is not supported yet");
    }

    return ResponseEntity.noContent().build();
  }

  @PostMapping("{id}/invite/{action}")
  ResponseEntity<Void> getUserInvite(@PathVariable UUID id,
      @PathVariable CommunityMembershipAction action,
      @AuthenticationPrincipal UserPrincipal principal) {

    switch (action) {
      case ACCEPT -> communityInternalApi.acceptUserMembershipInvite(id, principal.userId());
      case REJECT -> communityInternalApi.rejectUserMembershipInvite(id, principal.userId());
      case null, default -> throw new IllegalArgumentException("Invalid action");
    }

    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("{id}/invite/{userId}")
  @PreAuthorize("hasPermission(#id, 'COMMUNITY', 'CAN_UPDATE_INVITATION')")
  ResponseEntity<Void> getUserInvite(@PathVariable UUID id,
      @PathVariable UUID userId,
      @AuthenticationPrincipal UserPrincipal principal) {

    communityInternalApi.removeUserMembershipInvite(id, userId, principal.userId());

    return ResponseEntity.noContent().build();
  }
}
