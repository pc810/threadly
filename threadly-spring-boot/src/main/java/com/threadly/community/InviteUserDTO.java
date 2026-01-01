package com.threadly.community;

import com.threadly.membership.CommunityRole;
import java.util.UUID;

public record InviteUserDTO(
    UUID userId,
    CommunityRole role
) {

}
