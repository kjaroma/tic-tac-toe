import Fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import fastifyJWT from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { staticRoutes } from "./modules/static/static.routes";
import { setupGracefulShutdown } from './utils/server/shutdown';
import { healthcheckRoutes } from './modules/healthcheck/healthcheck.routes';
import { loadSchemas } from './utils/server/loadSchemas';
import { loadConfig } from './utils/server/config/loadConfig';

export const init = async (opts: FastifyServerOptions): Promise<FastifyInstance> => {
  const app: FastifyInstance = Fastify(opts);

  loadSchemas(app)
  await loadConfig(app)

  app.register(healthcheckRoutes, { prefix: '/healthcheck' })

  // app.register(gameRoutes, { prefix: "api/games" });
  // app.register(userRoutes, { prefix: "api/users" });

  app.register(fastifyJWT, { secret: app.config.JWT_SECRET });

  // #############################
  
  app.addHook("preHandler", (req, res, next) => {
    req.jwt = app.jwt;
    return next();
  });

  // cookies
  app.register(fCookie, {
    secret: "some-secret-key",
    hook: "preHandler",
  });

  // #############################


  app.register(staticRoutes);

  setupGracefulShutdown(app)

  await app.ready()
  return app;
}

export const run = (fastify: FastifyInstance) => {
  const port = process.env.PORT ?? 8000
  return fastify.listen({ port: +port })
}
