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
        taggedUsers: [User!]!
    }
    type User {
        githublogin: ID!
        name: String!
        avatar: String
        postedPhotos: [Photo!]!
        inPhotos: [Photo!]!
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
var tags = [
    {"photoId":"1", "userId":"gPlake"},
    {"photoId":"3", "userId":"sSchimidt"},
    {"photoId":"3", "userId":"mHattrup"},
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
    postedBy: root => users.find(u => u.githublogin === root.githublogin),
    taggedUsers: root => tags.filter(tag => tag.photoId === root.id)
    // Convert the array of tags into an array of userIDs
    .map(tag => tag.userId)
    // Converts array of userIDs into an array of user objects
    .map(userId => users.find(u => u.githublogin === userId))
  },
  User: {
    postedPhotos: root => photos.filter(p => p.githublogin === root.githublogin),
    inPhotos: root => tags
    // Returns an array of tags that only contain the current user
    .filter(tag => tag.userId === root.id)
    // Convert the array of tags into array of photoIDs
    .map(tag => tag.photoId)
    // Convert array of photoIDs into array of photo objects
    .map(photoId => photos.find(p => p.id === photoId))
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
  .listen()
  .then(({ url }) => console.log(`Graphql Service running on ${url}`));
