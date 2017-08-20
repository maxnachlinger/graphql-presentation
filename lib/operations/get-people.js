'use strict';

const _ = require('lodash');
const boom = require('boom');

module.exports = ({ models, usernames }) => {
  const username = usernames[0];
  if (!username) {
    return models.Person.findAll()
      .then((results) => [
        _.map(results, (result) => result.get({ plain: true }))
      ]);
  }

  return models.Person.findOne({
    where: { username }
  })
    .then((person) => {
      if (!person) {
        return Promise.reject(boom.notFound(`No person found with username: ${username}`));
      }
      return [[person.get({ plain: true })]];
    });
};
