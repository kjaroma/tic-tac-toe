import { FastifyCorsOptions } from '@fastify/cors';
import { isDevEnv } from '../../utils/env';

export const getCorsOptions = () =>
  isDevEnv()
    ? ({
        origin: '*',
        credentials: true,
      } as FastifyCorsOptions)
    : {};
