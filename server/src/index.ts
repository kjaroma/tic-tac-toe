import { init, run } from './app';
import { isDevEnv } from './utils/env';

void (async () => {
  const fastify = await init({ logger: isDevEnv() });
  await run(fastify);
})();
