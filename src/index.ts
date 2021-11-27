import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "../graphql/schema";
import { resolvers } from "../graphql/resolvers";
import { createContext } from "../graphql/context";

import cors from "cors";

const main = async () => {
  const app = express();
  app.use(cors());

  const apolloServer = new ApolloServer({
    schema,
    resolvers,
    context: createContext,
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
