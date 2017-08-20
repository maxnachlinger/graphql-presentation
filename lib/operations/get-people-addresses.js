'use strict';

const _ = require('lodash');

module.exports = ({ models, peopleIds }) => {
  // map of person-id -> [], so we'll have a result even if someone lacks an address
  const personAddressesMap = _.reduce(peopleIds, (accum, id) => {
    accum[id] = [];
    return accum;
  }, {});

  return models.Address.findAll({
    where: { personId: { in: peopleIds } }
  })
    .then((addresses) => {
      return _.reduce(addresses, (addressesResult, address) => {
        addressesResult[address.personId].push(address.get({ plain: true }));
        return addressesResult;
      }, personAddressesMap);
    })
    .then((resultMap) => _.values(resultMap));
};
