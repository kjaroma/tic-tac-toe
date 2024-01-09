import { IncomingMessage } from 'http';
import { Server, WebSocket } from 'ws';
import { GameMessageType } from '../../shared/types';
import { GameState } from '../game/tttgame';
import { IMessageService } from '../interfaces/IMessageService';

// TODO Add interface and tests

class MessageService implements IMessageService {
  constructor(
    private readonly server: Server<typeof WebSocket, typeof IncomingMessage>,
  ) {}

  private json = JSON.stringify;

  private broadcastMessage(message: string) {
    for (const client of this.server.clients) {
      client.send(message);
    }
  }

  private getMessageType(
    type: GameMessageType,
    payload: Record<string, unknown>,
  ) {
    return this.json({
      type,
      payload,
    });
  }

  private getStateMessage(state: GameState) {
    return this.getMessageType(GameMessageType.STATE_UPDATE, { state });
  }

  private getErrorMessage(message: string) {
    return this.getMessageType(GameMessageType.ERROR, { message });
  }

  public getInfoMessage(message: string) {
    return this.getMessageType(GameMessageType.INFO, { message });
  }

  public emitInfoMessage(message: string) {
    this.broadcastMessage(this.getInfoMessage(message));
  }

  public emitStateMessage(state: GameState) {
    this.broadcastMessage(this.getStateMessage(state));
  }

  public emitErrorMessage(message: string) {
    this.broadcastMessage(this.getErrorMessage(message));
  }
}

export default MessageService;
