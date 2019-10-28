const { ApolloServer } = require("apollo-server")

const typeDefs = `
    enum PhotoCategory{
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String!
        category: PhotoCategory!
    }
    input PostPhotoInput{
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }
    type Query{
        totalPhotos: Int!
        allPhotos: [Photo!]!
    }

    type Mutation{
        postPhoto(input: PostPhotoInput!): Photo!
    }
`;

var _id = 0
var photos = []

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },
  Mutation: {
    postPhoto(root, params){
        let newPhoto = {
            id: _id++,
            ...params.input
        }
        photos.push(newPhoto)
        
        return newPhoto
    }
  },
  Photo:{
      url: root => `http://letox.com/img/${root.id}.jpg`
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
  .listen()
  .then(({ url }) => console.log(`Graphql Service running on ${url}`));
