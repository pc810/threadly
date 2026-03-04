import z from "zod";
import { instant, sliceSchema } from "./utils";

export const createCommentRequestSchema = z.object({
	depth: z.number(),
	postId: z.string(),
	actorId: z.string(),
	communityId: z.string(),
	parentId: z.string().nullable().default(null),
	contentJson: z.any(),
	contentHtml: z.string(),
	contentText: z.string(),
});
export const commentDTOSchema = z.object({
	id: z.string(),
	userId: z.string(),
	postId: z.string(),
	communityId: z.string(),
	depth: z.number(),
	parentId: z.string().optional(),
	contentJson: z.any(),
	contentHtml: z.string(),
	contentText: z.string(),
	childCount: z.number(),
	createdAt: instant,
	updatedAt: instant,
});
export const commentDTOSliceSchema = sliceSchema(commentDTOSchema);
export type CommentDTO = z.infer<typeof commentDTOSchema>;
export type CommentDTOSlice = z.infer<typeof commentDTOSliceSchema>;
export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;
