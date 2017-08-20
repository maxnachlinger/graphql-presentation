'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const boom = require('boom');

module.exports = ({ models, Sequelize, sequelize, person }) => {
  const { username } = person;
  const ret = { id: person.id };
  const isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ;

  return sequelize.transaction({ isolationLevel }, (transaction) => {
    return Promise.all([
      models.Person.findOne({ where: { username } }),
      models.Person.findById(person.id)
    ])
      .then(([personWithUsername, personById]) => {
        if (!personById) {
          return Promise.reject(
            boom.notFound(`No user was found with id: ${person.id}`)
          );
        }

        // enforce unique usernames
        if (personWithUsername && personWithUsername.id !== person.id) {
          return Promise.reject(
            boom.badRequest(`Another user already has the username: ${username}`)
          );
        }
        return personById;
      })
      .then((foundPerson) => foundPerson.update(_.omit(person, 'id')))
      .then((updatedPerson) => {
        return models.Address.destroy({
          where: { personId: person.id }
        })
          .then(() => updatedPerson);
      })
      .then(() => {
        return models.Address.bulkCreate(_.map(person.addresses, (address) => {
          address.personId = person.id;
          return address;
        }), { transaction });
      })
      .then(() => ret);
  });
};
