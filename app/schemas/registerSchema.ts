import { z } from "zod";

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be at most 100 characters"),
    confirmPassword: z.string(),
    avatarUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
