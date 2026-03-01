import z from "zod";
import { contentSchema, instant } from "./utils";

export const POST_TYPE = {
	TEXT: "TEXT",
	MEDIA: "MEDIA",
	LINK: "LINK",
};

export const postTypeSchema = z.enum([
	POST_TYPE.LINK,
	POST_TYPE.MEDIA,
	POST_TYPE.TEXT,
]);

export const postSchema = z.object({
	id: z.string(),
	userId: z.string(),
	communityId: z.string(),
	title: z.string(),
	type: postTypeSchema,
	contentJson: z.any(),
	contentHtml: z.string(),
	contentText: z.string(),
	link: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	version: z.number(),
});

export const postFormSchema = z.object({
	community: z.string().min(1, "Please select a community"),
	type: z.enum(["text", "media", "link"]),
	title: z.string().min(3, "Title must be at least 3 characters"),
	content: contentSchema,
	media: z
		.any()
		.optional()
		.refine(
			(files) => !files || (Array.isArray(files) && files.length <= 3),
			"You can upload up to 3 files",
		),
	link: z
		.union([z.literal(""), z.string().url("Enter a valid URL")])
		.optional()
		.nullable(),
});

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

export const createCommentRequestSchema = z.object({
	depth: z.number(),
	postId: z.string(),
	actorId: z.string(),
	communityId: z.string(),
	parentId: z.string().optional(),
	contentJson: z.any(),
	contentHtml: z.string(),
	contentText: z.string(),
});

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;
export type PostLink = z.infer<typeof postLinkSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostFormValues = z.infer<typeof postFormSchema>;

// export interface Post {
// 	id: string;
// 	userId: string;
// 	communityId: string;
// 	title: string;
// 	type: "TEXT" | "MEDIA" | "LINK";
// 	contentJson: Document;
// 	contentHtml: string;
// 	contentText: string;
// 	link: string;
// 	createdAt: string;
// 	updatedAt: string;
// 	version: number;
// }
