import { v4 as uuidv4 } from 'uuid';
import { WSRoom } from '../../types';

class LobbyService {
  public rooms: Record<string, WSRoom[]> = {};

  constructor(private readonly maxClients: number) {}

  private closeRoom(roomId: string) {
    delete this.rooms[roomId];
  }

  public createRoom(socket: WSRoom): string {
    const roomId = uuidv4();
    socket.roomId = roomId;
    this.rooms[roomId] = [socket];
    return roomId;
  }

  public joinRoom(roomId: string, socket: WSRoom) {
    if (!Object.keys(this.rooms).includes(roomId)) {
      return;
    }

    if (this.rooms[roomId].length >= this.maxClients) {
      return;
    }
    socket.roomId = roomId;
    this.rooms[roomId].push(socket);
    return roomId;
  }

  public leaveRoom(socket: WSRoom): boolean {
    const { roomId } = socket;
    this.rooms[roomId] = (this.rooms[roomId] ?? []).filter(
      (so) => so !== socket,
    );
    if (this.rooms[roomId].length === 0) {
      this.closeRoom(roomId);
      return true;
    }
    return false;
  }

  public getRoomSockets(roomId: string): WSRoom[] {
    return this.rooms[roomId] ?? [];
  }

  public getRoomIdFromSocket(socket: WSRoom): string {
    return socket.roomId ?? '';
  }

  public getLobbyInfo() {
    return Object.entries(this.rooms).map(([id, room]) => ({
      id: id,
      players: room.length,
    }));
  }
}

export default LobbyService;
