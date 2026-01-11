import z from "zod";

export const registerUserRequestSchema = z.object({
	name: z.string().min(1, "Name required"),
	email: z.email(),
	password: z.string().min(8),
});
export type RegisterUserRequest = z.infer<typeof registerUserRequestSchema>;

export const loginRequestSchema = z.object({
	email: z.email("Enter valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
