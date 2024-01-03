import { PrismaClient, Game } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

export class GameRepository extends BaseRepository<Game> {
    constructor(private prisma: PrismaClient) {
        super(prisma.game)
    }
}