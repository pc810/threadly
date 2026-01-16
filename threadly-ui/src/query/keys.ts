// export const postKeys = {
// 	all: ["posts"] as const,

import type { ResourceType } from "@/types/permission";

// 	lists: () => [...postKeys.all, "list"] as const,

// 	list: (filters: { communityId?: string; page?: number } = {}) =>
// 		[...postKeys.lists(), { filters }] as const,

// 	details: () => [...postKeys.all, "detail"] as const,

// 	detail: (postId: string) => [...postKeys.details(), postId] as const,

// 	// comments: (postId: string) =>
// 	// 	[...postKeys.detail(postId), "comments"] as const,

// 	// comment: (postId: string, commentId: string) =>
// 	// 	[...postKeys.comments(postId), commentId] as const,
// };

const KEYS = {
	Auth: "Auth" as const,
	Community: "Community" as const,
	Permission: "Permission" as const,
	Media: "Media" as const,
	Feed: "Feed" as const,
	User: "User" as const,
};

const authKeys = {
	all: [KEYS.Auth],

	me: () => [...authKeys.all, "me"],

	signup: () => [...authKeys.all, "signup"],

	login: () => [...authKeys.all, "login"],
};

const communityKeys = {
	all: [KEYS.Community],

	list: () => [...communityKeys.all, "list"],

	details: () => [...communityKeys.all, "detail"],

	detail: (communityId: string) => [...communityKeys.details(), communityId],

	invitations: (communityId: string) => [
		...communityKeys.detail(communityId),
		"invitations",
	],

	invitation: (communityId: string, userId: string) => [
		...communityKeys.invitations(communityId),
		userId,
	],

	memberships: (communityId: string, filters?: Record<string, unknown>) =>
		[...communityKeys.detail(communityId), "membership", filters].filter(
			Boolean,
		),

	membershipsInvite: (communityId: string, filters?: Record<string, unknown>) =>
		[...communityKeys.memberships(communityId), "invite", filters].filter(
			Boolean,
		),

	membershipsInviteRemote: (communityId: string) => [
		...communityKeys.membershipsInvite(communityId),
		"remote",
	],

	posts: (communityId: string) => [
		...communityKeys.detail(communityId),
		"post",
	],

	feed: (communityId: string) => [...communityKeys.detail(communityId), "feed"],

	post: (communityId: string, postId: string) => [
		...communityKeys.posts(communityId),
		postId,
	],

	postLinks: (communityId: string, postId: string) => [
		...communityKeys.post(communityId, postId),
		"link",
	],
};

const permissionKeys = {
	all: [KEYS.Permission],

	resources: (resource: ResourceType) => [...permissionKeys.all, resource],

	resource: (
		resource: ResourceType,
		resourceId: string,
		permissions?: readonly unknown[],
	) =>
		[...permissionKeys.resources(resource), resourceId, permissions].filter(
			Boolean,
		),
};

const mediaKeys = {
	all: [KEYS.Media],

	details: () => [...mediaKeys.all],

	detail: (mediaId: string) => [...mediaKeys.details(), mediaId],
};

const feedKeys = {
	all: [KEYS.Feed],

	list: () => [...feedKeys.all],

	users: [...communityKeys.all, "users"],

	user: (userId: string) => [...feedKeys.users, userId],
};

const userKeys = {
	all: [KEYS.User],

	details: () => [...userKeys.all],

	detail: (userId: string) => [...userKeys.details(), userId],

	search: (
		query: string,
		options?: Partial<{ excludeSelf: boolean; enabled: boolean }>,
	) => [...feedKeys.all, "search", query, options].filter(Boolean),
};

export const queryKeys = {
	auth: authKeys,
	community: communityKeys,
	permission: permissionKeys,
	media: mediaKeys,
	feed: feedKeys,
	user: userKeys,
};
