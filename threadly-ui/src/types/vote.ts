import z from "zod";
import { instant } from "./utils";

export const VOTE_DIRECTION = {
	UP: 1,
	DOWN: -1,
} as const;

export const voteDirectionSchema = z.enum([
	VOTE_DIRECTION.UP.toString(),
	VOTE_DIRECTION.DOWN.toString(),
]);

export const voteIdSchema = z.object({
	userId: z.string(),
	commentId: z.string().nullable(),
	postId: z.string().nullable(),
});

export const voteSchema = z.object({
	id: voteIdSchema,
	direction: z
		.number()
		.int()
		.refine((val) => val === 1 || val === -1, {
			message: "Direction must be 1 (upvote) or -1 (downvote)",
		}),
	createdAt: instant,
	version: z.number().int().default(0),
});
export const createVoteRequestSchema = z.object({
	id: voteIdSchema,
	direction: z
		.number()
		.int()
		.refine((val) => val === 1 || val === -1, {
			message: "Direction must be 1 (upvote) or -1 (downvote)",
		}),
});

export type Vote = z.infer<typeof voteSchema>;
export type VoteId = z.infer<typeof voteIdSchema>;
export type CreateVoteRequest = z.infer<typeof createVoteRequestSchema>;
