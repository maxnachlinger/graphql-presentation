'use strict';

module.exports = `
  enum AddressTypeId {
    none,
    home,
    work
  }
  
  type Address {
    id: Int!
    addressTypeId: AddressTypeId!
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
    id: Int!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    addresses: [AddressInput]
  }
  
  type ChangeResult {
    id: Int!
  }
  
  type Query {
    people(username: String = ""): [Person]
  }
  
  type Mutation {
    addPerson (person: NewPersonInput!): ChangeResult
    updatePerson (person: ChangePersonInput!): ChangeResult
    deletePerson (id: Int!): ChangeResult
  }
`;
