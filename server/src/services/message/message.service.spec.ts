import { Server, WebSocket } from 'ws';
import { GameState } from '../../shared/types';
import MessageService from './message.service';

// Mock WebSocket and Server
jest.mock('ws');

describe('MessageService', () => {
  let mockServer: Server<typeof WebSocket>;

  beforeEach(() => {
    mockServer = new Server();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of MessageService', () => {
    const messageService = new MessageService(mockServer);
    expect(messageService).toBeInstanceOf(MessageService);
  });

  it('should emit info message to all clients', () => {
    const messageService = new MessageService(mockServer);
    const mockInfoMessage =
      '{"type":"info","payload":{"message":"Test message"}}';
    const mockClient1 = { send: jest.fn() };
    const mockClient2 = { send: jest.fn() };

    mockServer.clients = new Set([
      mockClient1,
      mockClient2,
    ]) as unknown as Set<WebSocket>;

    messageService.emitInfoMessage('Test message');

    expect(mockClient1.send).toHaveBeenCalledWith(mockInfoMessage);
    expect(mockClient2.send).toHaveBeenCalledWith(mockInfoMessage);
  });

  it('should emit state message to all clients', () => {
    const messageService = new MessageService(mockServer);
    const mockStateMessage =
      '{"type":"state_update","payload":{"state":{"test":"data"}}}';
    const mockClient1 = { send: jest.fn() };
    const mockClient2 = { send: jest.fn() };

    mockServer.clients = new Set([
      mockClient1,
      mockClient2,
    ]) as unknown as Set<WebSocket>;

    messageService.emitStateMessage({ test: 'data' } as unknown as GameState);

    expect(mockClient1.send).toHaveBeenCalledWith(mockStateMessage);
    expect(mockClient2.send).toHaveBeenCalledWith(mockStateMessage);
  });

  it('should emit error message to all clients', () => {
    const messageService = new MessageService(mockServer);
    const mockErrorMessage =
      '{"type":"error","payload":{"message":"Error message"}}';
    const mockClient1 = { send: jest.fn() };
    const mockClient2 = { send: jest.fn() };

    mockServer.clients = new Set([
      mockClient1,
      mockClient2,
    ]) as unknown as Set<WebSocket>;

    messageService.emitErrorMessage('Error message');

    expect(mockClient1.send).toHaveBeenCalledWith(mockErrorMessage);
    expect(mockClient2.send).toHaveBeenCalledWith(mockErrorMessage);
  });
});
