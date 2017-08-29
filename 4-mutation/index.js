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
  
  input AddressInput {
    addressTypeId: AddressTypeId!
    address: String!
    address2: String
    district: String!
    city: String! 
    postalCode: String!
  }
  
  input NewPersonInput {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    addresses: [AddressInput]
  }
  
  input ChangePersonInput {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    addresses: [AddressInput]
  }
  
  type ChangeResult {
    id: ID!
  }
  
  type Query {
    people(username: String = ""): [Person]
  }
  
  type Mutation {
    addPerson (person: NewPersonInput!): ChangeResult
    updatePerson (person: ChangePersonInput!): ChangeResult
    deletePerson (id: ID!): ChangeResult
  }
`;

const resolvers = {
  Query: {
    people: (root, { username }, context) => mockDal.getPeople({ username })
  },
  Person: {
    addresses: (person, { addressTypeId }, { addressesLoader }) => {
      return addressesLoader.load({ personId: person.id, addressTypeId });
    }
  },
  Mutation: {
    addPerson: (root, { person }, context) => mockDal.addPerson({ person }),
    updatePerson: (root, { person }, context) => mockDal.updatePerson({ person }),
    deletePerson: (root, { id }, context) => mockDal.deletePerson({ id })
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
