import { v4 as uuidv4 } from 'uuid';
import { WSRoom } from '../../types';

class LobbyService {
    public rooms: Record<string, WSRoom[]> = {};

    constructor(private readonly maxClients: number) { }

    private closeRoom(roomId: string) {
        delete this.rooms[roomId]
    }

    public createRoom(socket: WSRoom): string {
        const roomId = uuidv4();
        socket.roomId = roomId
        this.rooms[roomId] = [socket]
        return roomId
    }

    public joinRoom(roomId: string, socket: WSRoom) {
        if (!Object.keys(this.rooms).includes(roomId)) {
            // console.warn(`Room ${roomId} does not exist!`);
            return;
        }

        if (this.rooms[roomId].length >= this.maxClients) {
            // console.warn(`Room ${roomId} is full!`);
            return;
        }
        socket.roomId = roomId;
        this.rooms[roomId].push(socket)
    }

    public leaveRoom(socket: WSRoom) {
        const {roomId} = socket
        this.rooms[roomId] = this.rooms[roomId].filter(so => so !== socket)
        if(this.rooms[roomId].length === 0) {
            this.closeRoom(roomId)
        }
    }

    public getRoomSockets(roomId: string): WSRoom[] {
        return this.rooms[roomId] ?? []
    }

    public getRoomIdFromSocket(socket: WSRoom): string {
        return socket.roomId ?? ""
    }
}

export default LobbyService;