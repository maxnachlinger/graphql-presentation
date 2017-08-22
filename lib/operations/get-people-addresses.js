'use strict';

const _ = require('lodash');
const { idToType, typeToId } = require('./address-type-to-id-map');

module.exports = ({ models, peopleIdsAddressTypes }) => {
  const { resultMap, personAddressTypeMap, peopleIds, addressTypeIdMap } = _.reduce(
    peopleIdsAddressTypes,
    (accum, personIdAddressType) => {
      const { personId, addressTypeId } = personIdAddressType;
      accum.resultMap[personId] = [];
      accum.peopleIds.push(personId);

      if (addressTypeId && addressTypeId !== 'none') {
        const translatedType = typeToId[addressTypeId];
        accum.personAddressTypeMap[personId] = translatedType;
        accum.addressTypeIdMap[translatedType] = 1;
      }

      return accum;
    },
    { resultMap: {}, personAddressTypeMap: {}, peopleIds: [], addressTypeIdMap: {} }
  );

  const addressTypeIds = _.keys(addressTypeIdMap);
  const where = {
    personId: { in: peopleIds }
  };

  if (!_.isEmpty(addressTypeIds)) {
    where.addressTypeId = { in: addressTypeIds }
  }

  return models.Address.findAll({ where })
    .then((addresses) => {
      return _.reduce(addresses, (accum, address) => {
        const filterType = personAddressTypeMap[address.personId];
        if (filterType && address.addressTypeId !== filterType) {
          return accum;
        }

        accum[address.personId].push(address.get({ plain: true }));
        return accum;
      }, resultMap);
    })
    .then((resultMap) => _.map(_.values(resultMap), (addresses) => {
      return _.map((addresses), (address) => {
        address.addressTypeId = idToType[address.addressTypeId];
        return address;
      });
    }));
};
