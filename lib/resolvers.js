'use strict';

const { addPerson, updatePerson, deletePerson, getPeople } = require('./operations/index');

module.exports = {
  Query: {
    people: (args, { username = '' }, { models }) => {
      return getPeople({ models, username });
    }
  },
  Mutation: {
    addPerson: (args, { person }, { models, sequelize, Sequelize }) => {
      return addPerson({ models, Sequelize, sequelize, person });
    },
    updatePerson: (args, { person }, { models, sequelize, Sequelize }) => {
      return updatePerson({ models, Sequelize, sequelize, person });
    },
    deletePerson: (args, { id }, { models }) => {
      return deletePerson({ models, id });
    }
  },
  Person: {
    addresses: (person, { addressTypeId }, { addressesLoader }) => {
      return addressesLoader.load({ personId: person.id, addressTypeId });
    }
  }
};
