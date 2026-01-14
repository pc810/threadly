import z from "zod";
import { instant, sliceSchema } from "./utils";

export const postFeedDTOSchema = z.object({
	id: z.string(),
	userId: z.string(),
	postId: z.string(),
	communityId: z.string(),
	createdAt: instant,
});

export const postFeedSchema = postFeedDTOSchema.extend({ version: z.number() });

export const postFeedSliceSchema = sliceSchema(postFeedSchema);
export const postFeedDTOSliceSchema = sliceSchema(postFeedDTOSchema);

export type PostFeed = z.infer<typeof postFeedSchema>;
export type PostFeedSlice = z.infer<typeof postFeedSliceSchema>;
export type PostFeedDTO = z.infer<typeof postFeedDTOSchema>;
export type PostFeedDTOSlice = z.infer<typeof postFeedDTOSliceSchema>;
