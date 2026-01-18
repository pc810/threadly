import z from "zod";
import { instant } from "./utils";

export const registerUserRequestSchema = z.object({
	name: z.string().min(1, "Name required"),
	email: z.email(),
	password: z.string().min(8),
});

export const loginRequestSchema = z.object({
	email: z.email("Enter valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export const tokenDTOSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
	expires: z.number(),
	expiresRefreshToken: z.number(),
	expiresAt: instant,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterUserRequest = z.infer<typeof registerUserRequestSchema>;
export type tokenDTO = z.infer<typeof tokenDTOSchema>;
