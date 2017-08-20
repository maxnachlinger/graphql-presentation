'use strict';

module.exports = ({ models, id }) => {
  return models.Person.destroy({ where: { id } })
    .then(() => ({ id }));
};
