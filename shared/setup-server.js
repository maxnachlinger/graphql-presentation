'use strict';

const hapi = require('hapi');
const { graphiqlHapi } = require('graphql-server-hapi');

module.exports = () => {
  const server = new hapi.Server();
  server.connection({ port: 3000 });

  return new Promise((resolve, reject) => {
    server.register({
      register: graphiqlHapi,
      options: {
        path: '/graphiql',
        graphiqlOptions: {
          endpointURL: '/graphql',
        }
      }
    });

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
