'use strict';

const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Sequelize = require('sequelize');

module.exports = ({ config, logger }) => {
  const { username, password, database, host, port, pool } = config.database;

  const logging = (message, time) => logger(['info', 'database', 'sql'], { message, time });
  const options = { host, port, pool, dialect: 'mysql', logging, benchmark: true };

  const sequelize = new Sequelize(database, username, password, options);

  const thisFile = path.basename(__filename);

  return fs.readdirAsync(__dirname)
    .then((files) => _.filter(files, (file) => file !== thisFile))
    .then((files) => {
      const models = _.reduce(files, (accum, file) => {
        const model = sequelize.import(path.join(__dirname, file));
        accum[model.name] = model;
        return accum;
      }, {});

      models.Address.belongsTo(models.Person, {
        foreignKey: 'person_id'
      });

      return { Sequelize, sequelize, models };
    });
};
