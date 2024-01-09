import { FastifyCorsOptions } from '@fastify/cors';
import { isDevEnv } from '../../utils/env';

export const getCorsOptions = () =>
  isDevEnv()
    ? ({
        origin: (origin, cb) => {
          if (origin) {
            const hostname = new URL(origin!).hostname;
            if (hostname === 'localhost') {
              cb(null, true);
              return;
            }
            cb(new Error('Not allowed'), false);
          }
        },
        credentials: true,
      } as FastifyCorsOptions)
    : {};
