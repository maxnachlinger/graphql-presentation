'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const { people, addresses } = require('./data.json');
const usernameMap = _.keyBy(people, 'username'); // username -> Person
const addressesMap = _.groupBy(addresses, 'personId'); // personId -> [Sddress]

module.exports.getPeople = ({ username } = {}) => {
  if (username) {
    if (!usernameMap[username]) {
      return Promise.reject(new Error(`No person found with username: ${username}`));
    }
    return [usernameMap[username]];
  }

  return Promise.resolve(_.values(usernameMap));
};

module.exports.getPersonAddresses = ({ person, addressTypeId } = {}) => {
  console.log(`getPersonAddresses called for person.id: ${person.id}`);
  const addresses = addressesMap[person.id];
  if (!addresses) {
    return Promise.resolve([]);
  }

  if (!addressTypeId || addressTypeId === 'none') {
    return Promise.resolve(addresses);
  }

  return Promise.resolve(
    _.filter(addresses, { addressTypeId })
  );
};

module.exports.getPeopleAddresses = (personIdAddressType) => {
  console.log('getPeopleAddresses called');
  // personId -> [addresses] map for our return
  const ret = _.reduce(personIdAddressType, (accum, { personId, addressTypeId = 'none' }) => {
    if (!accum[personId]) {
      accum[personId] = [];
    }

    accum[personId] = _.filter(
      addressesMap[personId],
      (a) => addressTypeId === 'none' || a.addressTypeId === addressTypeId
    );
    return accum;
  }, {});

  return Promise.resolve(_.values(ret));
};

let lastAddressId = _.reduce(people, (accum, address) => {
  return address.id > accum ? address.id : accum;
}, 0);

let lastPersonId = _.reduce(people, (accum, person) => {
  return person.id > accum ? person.id : accum;
}, 0);

module.exports.addPerson = ({ person }) => {
  person.id = ++lastPersonId;
  people.push(person);

  usernameMap[person.username] = person;
  addressesMap[person.id] = [];

  if (!_.isEmpty(person.addresses)) {
    _.forEach(person.addresses, (address) => {
      address.id = ++lastAddressId;
      addresses.push(address);
      addressesMap[person.id].push(address);
    });
  }

  return Promise.resolve({ id: person.id });
};

module.exports.updatePerson = ({ person }) => {
  usernameMap[person.username] = person;
  addressesMap[person.id] = [];

  if (!_.isEmpty(person.addresses)) {
    _.forEach(person.addresses, (address) => {
      address.id = ++lastAddressId;
      addresses.push(address);
      addressesMap[person.id].push(address);
    });
  }

  return Promise.resolve({ id: person.id });
};

module.exports.deletePerson = ({ id }) => {
  const person = _.filter(people, (p) => p.id === id)[0];
  if (!person) {
    return Promise.resolve({ id }); // noop
  }

  delete usernameMap[person.username];
  delete addressesMap[person.id];
  return Promise.resolve({ id });
};
