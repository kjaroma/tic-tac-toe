import z from "zod";

const joinGameSchema = z.object({
    gameId: z.string({
        required_error: 'Game ID is required',
        invalid_type_error: 'Invalid game ID'
    }).uuid()
})

export type JoinGameUserInput = z.infer<typeof joinGameSchema>

export const gameSchemas = {
    joinGameSchema
}