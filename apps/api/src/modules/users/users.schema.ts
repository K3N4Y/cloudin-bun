import { z } from "zod";
import type { User } from "../../db/schema";

export const createUserSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(32),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type PublicUser = Omit<User, "passwordHash">;
