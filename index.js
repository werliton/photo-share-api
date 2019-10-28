const { ApolloServer } = require("apollo-server")

const typeDefs = `
    type Query{
        totalPhotos: Int!
    }

    type Mutation{
        postPhoto(name: String!, description: String): Boolean!
    }
`;

var photos = []

const resolvers = {
  Query: {
    totalPhotos: () => photos.length
  },
  Mutation: {
    postPhoto(root, params){
        photos.push(params)
        return true
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
  .listen()
  .then(({ url }) => console.log(`Graphql Service running on ${url}`));
