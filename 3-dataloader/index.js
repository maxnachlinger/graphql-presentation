'use strict';

const { graphqlHapi } = require('graphql-server-hapi');
const { makeExecutableSchema } = require('graphql-tools');
const DataLoader = require('dataloader');
const mockDal = require('../shared/mock-dal');
const setupServer = require('../shared/setup-server');

const typeDefs = `
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
    addresses(addressTypeId: AddressTypeId = none): [Address]
  }
  
  type Query {
    people(username: String = ""): [Person]
  }
`;

const resolvers = {
  Query: {
    // I'm not using the 3rd param so I've omitted it
    people: (root, { username }) => mockDal.getPeople({ username })
  },
  Person: {
    // the old busted approach - long may it remain commented out!
    // addresses: (person, { addressTypeId }, context) => {
    //   return mockDal.getPersonAddresses({ person, addressTypeId });
    // }
    addresses: (person, { addressTypeId }, { addressesLoader }) => {
      return addressesLoader.load({ personId: person.id, addressTypeId });
    }
  }
};

const addressesLoader = new DataLoader((keys) => {
  return mockDal.getPeopleAddresses(keys);
});

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
          request,
          addressesLoader
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
