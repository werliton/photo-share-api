const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs')

const typeDefs = readFileSync('./typeDefs.graphql', 'UFT-8')
const resolvers = require('./resolvers')

var app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers
});
// Call applyMiddleqare() to allow middleware mounted on the same path
server.applyMiddleware({ app });

// Create a home route
app.get("/", (req, res) => res.end("Welcome to the PhotoShare API"));
app.get('/playground', expressPlayground({endpoint: '/graphql'}))

app.listen({ port: 4000 }, () =>
  console.log(`Graphql Service running on @
    http://localhost:4000${server.graphqlPath}
  `)
);
