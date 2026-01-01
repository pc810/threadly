import z from "zod";
import { AUTH_ROLE, instant, pageSchema } from "./common";

export enum CommunityVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}
export interface Community {
  id: string;
  ownerId: string;
  name: string;
  title: string;
  description: string;
  nsfw: boolean;
  visibility: CommunityVisibility;

  updatedAt: string;
  createdAt: string;
  version: number;
}

export const createCommunityRequestSchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters long")
    .max(64, "Community name must be at most 60 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Community name can only contain letters, numbers, and underscores (no spaces)"
    ),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(128, "Title must be at most 128 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(512, "Description must be at most 512 characters long"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  isNsfw: z.boolean(),
});

export const communityMembershipIdSchema = z.object({
  communityId: z.uuid(),
  userId: z.uuid(),
});

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

export type CommunityRole = keyof typeof COMMUNITY_ROLE;

export const CommunityRoleLabel: Record<CommunityRole, string> = {
  PUBLIC: "Public",
  AUTHOR: "Owner",
  MEMBER: "Member",
  MOD: "Moderator",
};

export const communityRoleSchema = z.enum(
  Object.values(COMMUNITY_ROLE) as [string, ...string[]]
);

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
  communityMembershipDTOSchema
);
export const communityMembershipInviteDTOPageSchema = pageSchema(
  communityMembershipInviteDTOSchema
);

export const inviteUserDTOSchema = z.object({
  userId: z.uuid(),
  role: communityRoleSchema,
});

export const communityInviteActionSchema = z.enum([
  COMMUNITY_INVITE_ACTION.ACCEPT,
  COMMUNITY_INVITE_ACTION.REJECT,
]);

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
