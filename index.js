const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { MongoClient } = require("mongodb");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const { readFileSync } = require("fs");
require("dotenv").config();

const typeDefs = readFileSync("./typeDefs.graphql", "UFT-8");
const resolvers = require("./resolvers");

// Create Asynchronous Function
async function start() {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });

  const db = client.db();

  const context = { db };

  const server = new ApolloServer({ typeDefs, resolvers, context });
  // Call applyMiddleqare() to allow middleware mounted on the same path
  server.applyMiddleware({ app });

  // Create a home route
  app.get("/", (req, res) => res.end("Welcome to the PhotoShare API"));
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  app.listen({ port: 4000 }, () =>
    console.log(`Graphql Service running on @
    http://localhost:4000${server.graphqlPath}
  `)
  )
}

start();
