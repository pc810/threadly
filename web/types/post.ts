import z from "zod";

export interface Post {
  id: string;
  userId: string;
  title: string;
  type: "TEXT" | "MEDIA" | "LINK";
  contentJson: any;
  contentHtml: string;
  contentText: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export const createPostRequestSchema = z.object({
  title: z.string(),
  type: z.string(),
  link: z.string(),
  contentJson: z.string(),
  contentHtml: z.string(),
  contentText: z.string(),
  communityId: z.string(),
});

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
