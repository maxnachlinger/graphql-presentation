'use strict';

const _ = require('lodash');
const hapi = require('hapi');
const { graphqlHapi, graphiqlHapi } = require('graphql-server-hapi');
const { makeExecutableSchema } = require('graphql-tools');
const setupModels = require('./lib/models');
const config = require('./config');
const typeDefs = require('./lib/typeDefs');
const resolvers = require('./lib/resolvers');
const operations = require('./lib/operations');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const setupServer = () => {
  const server = new hapi.Server();
  server.connection({ port: config.server.port });

  return new Promise((resolve, reject) => {
    server.register({
      register: require('good'),
      options: {
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*', error: '*' }]
          }, {
            module: 'good-squeeze',
            name: 'SafeJson'
          }, 'stdout']
        }
      }
    }, (err) => err ? reject(err) : resolve(server));
  });
};

const setupGraphQL = ({ server, models, Sequelize, sequelize }) => {
  server.register({
    register: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: (request) => {
        const { addressesLoader } = operations.getLoaders(models);

        return {
          schema,
          context: {
            request,
            models,
            Sequelize,
            sequelize,
            addressesLoader
          }
        };
      },
      route: { cors: true }
    }
  });

  server.register({
    register: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql',
      },
    },
  });
};

return setupServer()
  .then((server) => {
    const logger = _.bind(server.log, server);
    return setupModels({ config, logger })
      .tap(() => {
        server.log(['info', 'startup'], { message: 'Model/loaders setup' });
      })
      .then(({ models, Sequelize, sequelize }) => {
        return setupGraphQL({ server, models, Sequelize, sequelize });
      })
      .then(() => {
        return server.start((err) => {
          if (err) {
            throw err;
          }
          server.log(['info', 'startup'], { message: `Server running at: ${server.info.uri}` });
        });
      });
  })
  .catch((err) => {
    console.error(err, err.stack);
    process.exit(1);
  });
