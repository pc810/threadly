import z from "zod";
import { instant } from "./common";

export interface Post {
  id: string;
  userId: string;
  communityId: string;
  title: string;
  type: "TEXT" | "MEDIA" | "LINK";
  contentJson: Document;
  contentHtml: string;
  contentText: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export const postLinkSchema = z.object({
  id: z.uuid(),
  postId: z.uuid(),
  mediaId: z.uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: instant.optional(),
  updatedAt: instant.optional(),
});

export const createPostRequestSchema = z.object({
  title: z.string(),
  type: z.string(),
  link: z.string(),
  contentJson: z.any(),
  contentHtml: z.string(),
  contentText: z.string(),
  communityId: z.string(),
});

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
export type PostLink = z.infer<typeof postLinkSchema>;
