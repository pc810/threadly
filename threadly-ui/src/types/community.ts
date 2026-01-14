import z from "zod";
import { AUTH_ROLE, instant, pageSchema } from "./utils";

export const COMMUNITY_ROLE = {
	AUTHOR: AUTH_ROLE.AUTHOR,
	MOD: AUTH_ROLE.MOD,
	MEMBER: AUTH_ROLE.MEMBER,
	PUBLIC: AUTH_ROLE.USER,
} as const;

export const COMMUNITY_INVITE_ACTION = {
	ACCEPT: "ACCEPT",
	REJECT: "REJECT",
} as const;

export enum CommunityTopic {
	ART = "ART",
	BUSINESS_FINANCE = "BUSINESS_FINANCE",
	COLLECTIBLES = "COLLECTIBLES",
	EDUCATION_CAREER = "EDUCATION_CAREER",
	FASHION_BEAUTY = "FASHION_BEAUTY",
	FOOD_DRINKS = "FOOD_DRINKS",
	GAMES = "GAMES",
	HEALTH = "HEALTH",
	HOME_GARDEN = "HOME_GARDEN",
	HUMANITIES_LAW = "HUMANITIES_LAW",
	IDENTITY_RELATIONSHIPS = "IDENTITY_RELATIONSHIPS",
	INTERNET_CULTURE = "INTERNET_CULTURE",
	MOVIES_TV = "MOVIES_TV",
	MUSIC = "MUSIC",
	NATURE_OUTDOORS = "NATURE_OUTDOORS",
	NEWS_POLITICS = "NEWS_POLITICS",
	PLACES_TRAVEL = "PLACES_TRAVEL",
	POP_CULTURE = "POP_CULTURE",
	QAS_STORIES = "QAS_STORIES",
	READING_WRITING = "READING_WRITING",
	SCIENCES = "SCIENCES",
	SPOOKY = "SPOOKY",
	SPORTS = "SPORTS",
	TECHNOLOGY = "TECHNOLOGY",
	VEHICLES = "VEHICLES",
	WELLNESS = "WELLNESS",
	// MATURE_TOPICS = "MATURE_TOPICS",
}

export enum CommunityVisibility {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
}

export const communityVisibilitySchema = z.enum([
	CommunityVisibility.PRIVATE,
	CommunityVisibility.PUBLIC,
]);

export const communityTopicSchema = z.enum([
	CommunityTopic.ART,
	CommunityTopic.BUSINESS_FINANCE,
	CommunityTopic.COLLECTIBLES,
	CommunityTopic.EDUCATION_CAREER,
	CommunityTopic.FASHION_BEAUTY,
	CommunityTopic.FOOD_DRINKS,
	CommunityTopic.GAMES,
	CommunityTopic.HEALTH,
	CommunityTopic.HOME_GARDEN,
	CommunityTopic.HUMANITIES_LAW,
	CommunityTopic.IDENTITY_RELATIONSHIPS,
	CommunityTopic.INTERNET_CULTURE,
	CommunityTopic.MOVIES_TV,
	CommunityTopic.MUSIC,
	CommunityTopic.NATURE_OUTDOORS,
	CommunityTopic.NEWS_POLITICS,
	CommunityTopic.PLACES_TRAVEL,
	CommunityTopic.POP_CULTURE,
	CommunityTopic.QAS_STORIES,
	CommunityTopic.READING_WRITING,
	CommunityTopic.SCIENCES,
	CommunityTopic.SPOOKY,
	CommunityTopic.SPORTS,
	CommunityTopic.TECHNOLOGY,
	CommunityTopic.VEHICLES,
	CommunityTopic.WELLNESS,
	// CommunityTopic.MATURE_TOPICS,
]);

const communitySchema = z.object({
	id: z.string(),
	ownerId: z.string(),
	name: z.string(),
	title: z.string(),
	description: z.string(),
	nsfw: z.boolean(),
	topic: communityTopicSchema,
	visibility: communityVisibilitySchema,
	updatedAt: z.string(),
	createdAt: z.string(),
	version: z.number(),
});

export const createCommunityRequestSchema = z.object({
	name: z
		.string()
		.min(3, "Community name must be at least 3 characters long")
		.max(64, "Community name must be at most 60 characters long")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Community name can only contain letters, numbers, and underscores (no spaces)",
		),
	title: z
		.string()
		.min(3, "Title must be at least 3 characters long")
		.max(128, "Title must be at most 128 characters long"),
	topic: communityTopicSchema,
	description: z
		.string()
		.min(10, "Description must be at least 10 characters long")
		.max(512, "Description must be at most 512 characters long"),
	visibility: communityVisibilitySchema,
	isNsfw: z.boolean(),
});

export const updateCommunityFormSchema = createCommunityRequestSchema.pick({
	title: true,
	description: true,
	isNsfw: true,
});

export const communityMembershipIdSchema = z.object({
	communityId: z.uuid(),
	userId: z.uuid(),
});

export const communityRoleSchema = z.enum([
	COMMUNITY_ROLE.PUBLIC,
	COMMUNITY_ROLE.AUTHOR,
	COMMUNITY_ROLE.MOD,
	COMMUNITY_ROLE.MEMBER,
]);

export const communityMembershipDTOSchema = z.object({
	id: communityMembershipIdSchema,
	role: communityRoleSchema,
	joinedAt: instant,
});

export const communityMembershipInviteDTOSchema = z.object({
	id: communityMembershipIdSchema,
	role: communityRoleSchema,
	invitedBy: z.uuid(),
	createdAt: instant,
});

export const communityMembershipDTOPageSchema = pageSchema(
	communityMembershipDTOSchema,
);
export const communityMembershipInviteDTOPageSchema = pageSchema(
	communityMembershipInviteDTOSchema,
);

export const inviteUserDTOSchema = z.object({
	userId: z.uuid(),
	role: communityRoleSchema,
});

export const communityInviteActionSchema = z.enum([
	COMMUNITY_INVITE_ACTION.ACCEPT,
	COMMUNITY_INVITE_ACTION.REJECT,
]);

export const updateCommunityMetaDTOSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	isNsfw: z.boolean().optional(),
});

export type CommunityRole = keyof typeof COMMUNITY_ROLE;

export type CreateCommunityRequest = z.infer<
	typeof createCommunityRequestSchema
>;

export type CommunityMembershipDTO = z.infer<
	typeof communityMembershipDTOSchema
>;

export type communityMembershipId = z.infer<typeof communityMembershipIdSchema>;

export type CommunityMembershipDTOPage = z.infer<
	typeof communityMembershipDTOPageSchema
>;

export type CommunityMembershipInviteDTOPage = z.infer<
	typeof communityMembershipInviteDTOPageSchema
>;

export type InviteUserDTO = z.infer<typeof inviteUserDTOSchema>;

export type CommunityMembershipInviteDTO = z.infer<
	typeof communityMembershipInviteDTOSchema
>;
export type CommunityInviteAction = z.infer<typeof communityInviteActionSchema>;

export type UpdateCommunityMetaDTO = z.infer<
	typeof updateCommunityMetaDTOSchema
>;
export type updateCommunityForm = z.infer<typeof updateCommunityFormSchema>;
export type Community = z.infer<typeof communitySchema>;
