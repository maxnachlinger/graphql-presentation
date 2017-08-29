'use strict';

const { graphqlHapi } = require('graphql-server-hapi');
const { makeExecutableSchema } = require('graphql-tools');
const mockDal = require('../shared/mock-dal');
const setupServer = require('../shared/setup-server');

const typeDefs = `
  # possible value for address-type
  enum AddressTypeId {
    none,
    home,
    work
  }
  
  type Address {
    id: ID!
    addressTypeId: AddressTypeId!
    address: String!
    address2: String
    district: String!
    city: String! 
    postalCode: String!
  }
  
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    # A person can have 0 or more addresses, the addressTypeId allows callers to, for example
    # only select home addresses
    addresses(addressTypeId: AddressTypeId = none): [Address]
  }
  
  type Query {
    people(username: String = ""): [Person]
  }
`;

const resolvers = {
  Query: {
    people: (root, { username }, context) => mockDal.getPeople({ username })
  },
  Person: {
    addresses: (person, { addressTypeId }, { request }) => {
      return mockDal.getPersonAddresses({ person, addressTypeId });
    }
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
