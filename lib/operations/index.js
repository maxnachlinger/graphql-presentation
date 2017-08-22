'use strict';

const DataLoader = require('dataloader');
const getPeople = require('./get-people');
const getPeopleAddresses = require('./get-people-addresses');
const addPerson = require('./add-person');
const updatePerson = require('./update-person');
const deletePerson = require('./delete-person');

module.exports = {
  addPerson,
  updatePerson,
  deletePerson,
  getPeople,
  getLoaders: (models) => ({
    addressesLoader: new DataLoader((peopleIdsAddressTypes) => {
      return getPeopleAddresses({ models, peopleIdsAddressTypes });
    })
  })
};
