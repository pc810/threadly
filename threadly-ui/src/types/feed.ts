import z from "zod";
import { instant, sliceSchema } from "./utils";

export const postFeedSchema = z.object({
	id: z.string(),
	userId: z.string(),
	postId: z.string(),
	communityId: z.string(),
	createdAt: instant,
	version: z.number(),
});

export const postFeedSliceSchema = sliceSchema(postFeedSchema);

export type PostFeed = z.infer<typeof postFeedSchema>;
export type PostFeedSlice = z.infer<typeof postFeedSliceSchema>;
