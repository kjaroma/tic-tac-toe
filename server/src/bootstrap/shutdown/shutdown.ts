import { FastifyInstance } from 'fastify';

export const setupGracefulShutdown = (app: FastifyInstance) => {
  const listeners = ['SIGINT', 'SIGTERM'];
  listeners.forEach((signal) => {
    process.on(signal, async () => {
      await app.close();
      process.exit(0);
    });
  });
};
