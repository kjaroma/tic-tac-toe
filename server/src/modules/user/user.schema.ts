import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
  name: z.string(),
});

const authenticatedResponseSchema = z.object({
  accessToken: z.string(),
  userId: z.string(),
  name: z.string().nullable(),
}); 

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type AuthenticatedResponse = z.infer<typeof authenticatedResponseSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;

export const userSchemas = {
  createUserSchema,
  loginSchema,
  authenticatedResponseSchema,
};


