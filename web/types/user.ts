import z from "zod";

export const userDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UserDTO = z.infer<typeof userDTOSchema>;
