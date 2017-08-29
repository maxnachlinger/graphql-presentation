'use strict';

const { graphqlHapi } = require('graphql-server-hapi');
const { makeExecutableSchema } = require('graphql-tools');
const mockDal = require('../shared/mock-dal');
const setupServer = require('../shared/setup-server');

const typeDefs = `
  # the ! after a type means it is required
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
  }
  
  type Query {
    people: [Person] # optional list since we might not have results
  }
`;

// an objects of functions which populate the data defined by the schema, only the
// Query type is populated specifically
const resolvers = {
  Query: {
    people: (root, args, context) => mockDal.getPeople()
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
        // we can pass anything here that might be useful to our resolvers
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
