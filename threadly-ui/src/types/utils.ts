import type { AxiosError } from "axios";
import z from "zod";

export const AUTH_ROLE = {
	AUTHOR: "AUTHOR",
	MEMBER: "MEMBER",
	MOD: "MOD",
	USER: "USER",
	PUBLIC: "PUBLIC",
} as const;

export const instant = z
	.string()
	.refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid ISO date string",
	});

export const pageableSortSchema = z.object({
	empty: z.boolean(),
	sorted: z.boolean(),
	unsorted: z.boolean(),
});

export const pageableSchema = z.object({
	offset: z.number(),
	pageNumber: z.number(),
	pageSize: z.number(),
	paged: z.boolean(),
	sort: pageableSortSchema,
	unpaged: z.boolean(),
});

export const contentSchema = z.object({
	json: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
});

export const sliceSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
	z.object({
		content: z.array(contentSchema),
		empty: z.boolean(),
		first: z.boolean(),
		last: z.boolean(),
		number: z.number(),
		numberOfElements: z.number(),
		pageable: pageableSchema,
		size: z.literal(1),
		sort: pageableSortSchema,
	});

export const pageSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
	z.object({
		content: z.array(contentSchema),
		empty: z.boolean(),
		first: z.boolean(),
		last: z.boolean(),
		number: z.number(),
		numberOfElements: z.number(),
		pageable: pageableSchema,
		size: z.literal(1),
		sort: pageableSortSchema,
		totalPages: z.number(),
		totalElements: z.number(),
	});

export type PageableSort = z.infer<typeof pageableSortSchema>;
export type Pageable = z.infer<typeof pageableSchema>;

export type AppAxoisError = AxiosError<{ message?: string }>;
