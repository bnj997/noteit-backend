import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "../graphql/schema";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import prisma from "../lib/prisma";
import { COOKIE_NAME } from "./constants";

const main = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.set("trust proxy", 1);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
      proxy: true,
      saveUninitialized: false,
      secret: "dfgsdfgsfdgdfsg",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, prisma, redis }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
