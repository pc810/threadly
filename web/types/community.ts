import z from "zod";

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

export type CreateCommunityRequest = z.infer<
  typeof createCommunityRequestSchema
>;
