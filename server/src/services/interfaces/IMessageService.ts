import { GameState } from '../game/tttgame';

export interface IMessageService {
  getInfoMessage: (message: string) => string;
  emitInfoMessage: (message: string) => void;
  emitStateMessage: (state: GameState) => void;
  emitErrorMessage: (message: string) => void;
}
