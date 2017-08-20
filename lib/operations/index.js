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
  getLoaders: (models) => ({
    peopleLoader: new DataLoader((usernames) => getPeople({ models, usernames })),
    addressesLoader: new DataLoader((peopleIds) => getPeopleAddresses({ models, peopleIds }))
  })
};
