import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { PORT } from "./app/config";
import { resolver, typeDefs } from "./app/schemas/rootSchema";
import { connectToRedis } from "./app/libs/rateLimiter";

const app = express();
app.set("trust proxy", true);
const httpServer = http.createServer(app);

connectToRedis();

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolver,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startApolloServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      return { token, ip: req.ip, operationName: req.body.operationName };
    },
    listen: { port: PORT },
  });

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  console.log(`🚀 Server ready at ${url}`);
};

startApolloServer();
