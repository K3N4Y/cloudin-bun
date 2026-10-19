import { z } from "zod";
import type { User } from "../../db/schema";

export const emailSchema = z.string().trim().pipe(z.email()).transform((value) => value.toLowerCase());

export const createUserSchema = z.object({
  email: emailSchema,
  username: z.string().min(3).max(32),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type PublicUser = Omit<User, "passwordHash">;

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}
