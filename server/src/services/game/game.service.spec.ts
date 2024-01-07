import { GameRepository } from '../../repositories/GameRepository';
import GameService from './game.service';

describe('gameService', () => {
  const gs = new GameService((() => {}) as unknown as GameRepository, 3);
  it('should create empty board', () => {
    expect(gs).toBeDefined()
  });
});
