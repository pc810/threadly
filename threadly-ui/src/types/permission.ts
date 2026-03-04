export const ResourcePermissions = {
	SYS: ["USER", "AUTH", "ADMIN"] as const,
	COMMUNITY: [
		"VIEW",
		"UPDATE",
		"DELETE",
		"ADD_POST",
		"CAN_FOLLOW",
		"CAN_UNFOLLOW",
		"CAN_INVITE",
		"CAN_UPDATE_INVITATION",
		"FOLLOWER",
		"OWNER_PRIVILEGE",
		"MOD_PRIVILEGE",
	] as const,
	POST: [
		"CAN_VIEW",
		"CAN_UPDATE",
		"CAN_REMOVE",
		"CAN_ADD_COMMENT",
		"CAN_VIEW_COMMENT",
	] as const,
	COMMENT: ["CAN_VIEW", "CAN_VOTE"],
} as const;

export const ResourceTypeEnum = {
	SYS: "SYS",
	COMMUNITY: "COMMUNITY",
	POST: "POST",
} as const;

export type ResourceType = keyof typeof ResourcePermissions;

export type ResourcePermission<R extends ResourceType> =
	(typeof ResourcePermissions)[R][number];

export type PermissionResult<P extends readonly string[]> = {
	[K in P[number]]: boolean | undefined;
};
