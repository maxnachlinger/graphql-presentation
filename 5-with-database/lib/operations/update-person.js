'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const joi = require('joi');
const boom = require('boom');
const { typeToId } = require('./validation/address-type-to-id-map');
const { updateSchema } = require('./validation/person');

module.exports = ({ models, Sequelize, sequelize, person }) => {
  const { error } = joi.validate(person, updateSchema);
  if (error) {
    return Promise.reject(error);
  }

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
          address.addressTypeId = typeToId[address.addressTypeId];
          return address;
          return address;
        }), { transaction });
      })
      .then(() => ret);
  });
};
