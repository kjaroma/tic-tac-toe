import { v4 as uuidv4 } from 'uuid';

export async function createGame() {
    const gameId = uuidv4()
    console.log('Game created', gameId)
}

export async function joinGame() {
    console.log('Game joined')
}