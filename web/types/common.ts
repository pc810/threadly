import z from "zod";

export const instant = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid ISO date string",
});
