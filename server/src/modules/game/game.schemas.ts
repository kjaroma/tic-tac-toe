import z from 'zod';

const gamePlayQuerySchema = z.object({
  token: z.string(),
});

export type GamePlayQueryType = z.infer<typeof gamePlayQuerySchema>;

export const gameSchemas = {
  gamePlayQuerySchema,
};
