'use strict';

const { addPerson, updatePerson, deletePerson } = require('./operations');

module.exports = {
  Query: {
    people: (args, { username = '' }, { peopleLoader }) => peopleLoader.load(username)
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
    addresses: (person, args, { addressesLoader }) => addressesLoader.load(person.id)
  }
};
