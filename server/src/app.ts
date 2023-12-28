import Fastify, { FastifyRequest } from "fastify";
import { userRoutes } from "./modules/user/user.routes";
import { userSchemas } from "./modules/user/user.schema";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { staticRoutes } from "./modules/static/static.routes";
import { gameRoutes } from "./modules/game/game.routes";
import fastifyWebsocket, { SocketStream } from "@fastify/websocket";

const app = Fastify({ logger: true }); // you can disable logging

async function main() {
  await app.listen({
    port: 8000,
    host: "0.0.0.0",
  });
}

app.get("/healthcheck", (_, res) => {
  res.send({ message: "Success" });
});

app.register(gameRoutes, { prefix: "api/games" });
app.register(userRoutes, { prefix: "api/users" });
app.register(staticRoutes);

for (let schema of [...userSchemas]) {
  app.addSchema(schema);
}

// jwt
app.register(fjwt, { secret: "supersecretcode-CHANGE_THIS-USE_ENV_FILE" });

app.addHook("preHandler", (req, res, next) => {
  // here we are
  req.jwt = app.jwt;
  return next();
});

// cookies
app.register(fCookie, {
  secret: "some-secret-key",
  hook: "preHandler",
});

const listeners = ["SIGINT", "SIGTERM"];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
});

main();
