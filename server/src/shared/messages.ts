export enum GameMessageType {
  CREATE = 'create',
  JOIN = 'join',
  LEAVE = 'leave',
  MOVE = 'move',
  INFO = 'info',
  STATE_UPDATE = 'state_update',
  GAME_INVITATION = 'game_invitation',
  FINISH = 'finish',
  ERROR = 'error',
}

export type GameMessageJoinPayload = {
  roomId: string;
};

export type GameMessageInfoPayload = {
  message: string;
};

export type GameMessagePayload = GameMessageJoinPayload;

export type GameMessage = {
  type: keyof typeof GameMessageType;
  payload: GameMessagePayload;
};
