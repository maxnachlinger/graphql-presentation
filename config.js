'use strict';

module.exports = {
  database: {
    username: 'test',
    password: 'test',
    database: 'graphql-presentation',
    host: 'localhost',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },
  server: {
    port: 3000
  }
};
