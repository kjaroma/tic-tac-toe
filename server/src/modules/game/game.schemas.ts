import z from 'zod';

const createGameResponseSchema = z.object({
  gameId: z.string(),
});

const joinGameSchema = z.object({
  gameId: z.string({
    required_error: 'Game ID is required',
  }),
});

export type CreateGameResponse = z.infer<typeof createGameResponseSchema>;
export type JoinGameUserInput = z.infer<typeof joinGameSchema>;

export const gameSchemas = {
  createGameResponseSchema,
  joinGameSchema,
};
