import { GameRepository } from '../../repositories/GameRepository';
import GameService from './game.service';

describe('gameService', () => {
  const gs = new GameService((() => { }) as unknown as GameRepository);
  // TODO Add tests
  it('should be defined', () => {
    expect(gs).toBeDefined();
  });
});
