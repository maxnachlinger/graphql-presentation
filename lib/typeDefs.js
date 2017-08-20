'use strict';

module.exports = `
  type Address {
    id: Int!
    addressTypeId: Int!
    address: String!
    address2: String
    district: String!
    city: String! 
    postalCode: String!
  }
  
  type Person {
    id: Int!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    addresses: [Address]
  }
  
  input AddressInput {
    addressTypeId: Int!
    address: String!
    address2: String
    district: String!
    city: String! 
    postalCode: String!
  }
  
  input PersonInput {
    id: Int,
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    addresses: [AddressInput]
  }
  
  type PersonChangeResult {
    id: Int!
  }
  
  type Query {
    people (username: String): [Person]
  }
  
  type Mutation {
    addPerson (person: PersonInput): PersonChangeResult
    updatePerson (person: PersonInput): PersonChangeResult
    deletePerson (id: Int!): PersonChangeResult
  }
`;
