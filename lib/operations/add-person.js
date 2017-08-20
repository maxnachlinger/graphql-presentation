'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const boom = require('boom');

module.exports = ({ models, Sequelize, sequelize, person }) => {
  const { username } = person;
  const isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ;

  return sequelize.transaction({ isolationLevel }, (transaction) => {
    return models.Person.findOne({ where: { username } })
      .then((foundPerson) => {
        if (foundPerson) {
          return Promise.reject(boom.badRequest(`The username: ${username} is already in use. ` +
            'Please select a different username'));
        }
        // omitting id just in case it was passed
        return models.Person.create(_.omit(person, 'id'), { transaction });
      })
      .then((newPerson) => {
        const ret = { id: newPerson.id };
        const { addresses } = person;

        if (_.isEmpty(person.addresses)) {
          return ret;
        }

        return models.Address.bulkCreate(_.map(addresses, (address) => {
          address.personId = newPerson.id;
          return address;
        }), { transaction })
          .then(() => ret);
      });
  });
};
