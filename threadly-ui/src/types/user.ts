import z from "zod";
import { sliceSchema } from "./utils";

export const userDTOSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export type UserDTO = z.infer<typeof userDTOSchema>;

export const userDTOSliceSchema = sliceSchema(userDTOSchema);

export type UserDTOSlice = z.infer<typeof userDTOSliceSchema>;
