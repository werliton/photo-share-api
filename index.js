const { ApolloServer } = require("apollo-server");

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
        postedBy: User!
    }
    type User {
        githublogin: ID!
        name: String!
        avatar: String
        postedPhotos: [Photo!]!
    }
    input PostPhotoInput{
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }
    type Query{
        totalPhotos: Int!
        allPhotos: [Photo!]!
        allUsers: [User!]!
    }

    type Mutation{
        postPhoto(input: PostPhotoInput!): Photo!
    }
`;

var _id = 0;
var users = [
    {"githublogin":"mHattrup", "name":"Mike Hattrup"},
    {"githublogin":"gPlake", "name":"Glen Plake"},
    {"githublogin":"sSchimidt", "name":"Scot Schimidt"},
]
var photos = [
    {
        id:1,
        name:'Dropping the Heart Chuete',
        description: 'The heart chute is one of my favorite chutes',
        category: 'ACTION',
        githublogin: "gPlake"
    },
    {
        id:2,
        name:'Photo uploaded for Glen Plake',
        description: 'The heart chute is one of my favorite chutes',
        category: 'SELFIE',
        githublogin: "gPlake"
    },
    {
        id:3,
        name:'Any person do it',
        description: 'The heart chute is one of my favorite chutes',
        category: 'LANDSCAPE',
        githublogin: "sSchimidt"
    },
];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
    allUsers: () => users
  },
  Mutation: {
    postPhoto(root, params) {
      let newPhoto = {
        id: _id++,
        ...params.input
      };
      photos.push(newPhoto);

      return newPhoto;
    }
  },
  Photo: {
    url: root => `http://letox.com/img/${root.id}.jpg`,
    postedBy: root => {
        return users.find(u => u.githublogin === root.githublogin)
    }
  },
  User: {
      postedPhotos: root => {
          return photos.filter(p => p.githublogin === root.githublogin)
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
