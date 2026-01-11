import type { CommunityRole } from "@/types/community";

export const CommunityRoleLabel: Record<CommunityRole, string> = {
	PUBLIC: "Public",
	AUTHOR: "Owner",
	MEMBER: "Member",
	MOD: "Moderator",
};
