import z from "zod";

const imageMediaSchema = z.object({
	src: z.string(),
	width: z.number(),
	height: z.number(),
});

export type ImageMedia = z.infer<typeof imageMediaSchema>;
