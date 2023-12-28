import Fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import fastifyJWT from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { staticRoutes } from "./modules/static/static.routes";
import { setupGracefulShutdown } from './utils/server/shutdown';
import { healthcheckRoutes } from './modules/healthcheck/healthcheck.routes';
import { loadSchemas } from './utils/server/loadSchemas';
import { loadConfig } from './utils/server/config/loadConfig';
import { userRoutes } from "./modules/user/user.routes";

export const init = async (opts: FastifyServerOptions): Promise<FastifyInstance> => {
  const app: FastifyInstance = Fastify(opts);

  loadSchemas(app)
  await loadConfig(app)

  app.register(healthcheckRoutes, { prefix: '/healthcheck' })

  app.register(fastifyJWT, { secret: app.config.JWT_SECRET });

  app.register(userRoutes, { prefix: "api/users" });

  // #############################
  
  app.addHook("preHandler", (req, res, next) => {
    req.jwt = app.jwt;
    return next();
  });

  // #############################

  app.register(fastifyCookie, {
    secret: app.config.COOKIE_SIGN_SECRET,
    hook: "preHandler",
  });

  app.register(staticRoutes);

  setupGracefulShutdown(app)

  await app.ready()
  return app;
}

export const run = (fastify: FastifyInstance) => {
  const port = process.env.PORT ?? 8000
  return fastify.listen({ port: +port })
}
