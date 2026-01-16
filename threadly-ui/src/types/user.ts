import z from "zod";
import { sliceSchema } from "./utils";

const authProviderSchema = z.enum(["LOCAL", "GOOGLE"]);
const accountStatusSchema = z.enum(["ACTIVE", "SUSPENDED", "DELETED"]);

export const userDTOSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const userMetaDTOSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.email(),
	authProvider: authProviderSchema,
	status: accountStatusSchema,
});

export const userDTOSliceSchema = sliceSchema(userDTOSchema);

export type UserDTO = z.infer<typeof userDTOSchema>;
export type UserMetaDTO = z.infer<typeof userMetaDTOSchema>;
export type AuthProvider = z.infer<typeof authProviderSchema>;
export type AccountStatus = z.infer<typeof accountStatusSchema>;
export type UserDTOSlice = z.infer<typeof userDTOSliceSchema>;
