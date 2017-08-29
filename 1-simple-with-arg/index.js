'use strict';

const { graphqlHapi } = require('graphql-server-hapi');
const { makeExecutableSchema } = require('graphql-tools');
const mockDal = require('../shared/mock-dal');
const setupServer = require('../shared/setup-server');

const typeDefs = `
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
  }
  
  type Query {
    # allows filtering by username
    people(username: String = ""): [Person]
  }
`;

const resolvers = {
  Query: {
    // root will be empty, but we'll potentially use the username arg passed
    // the 2rd params is the context which is populated below
    people: (root, { username }, { request }) => mockDal.getPeople({ username })
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const setupGraphQL = ({ server }) => {
  server.register({
    register: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: (request) => ({
        schema,
        context: {
          request
        }
      }),
      route: { cors: true }
    }
  });
};

return setupServer()
  .then((server) => {
    setupGraphQL({ server });
    return server.start((err) => {
      if (err) {
        throw err;
      }
      server.log(['info', 'startup'], { message: `Server running at: ${server.info.uri}` });
    });
  })
  .catch((err) => {
    console.error(err, err.stack);
    process.exit(1);
  });
