/* eslint-disable global-require */

const Hapi = require('hapi');

const server = new Hapi.Server();

// allow port configuration through argv
server.connection({
  host: process.env.HOST,
  port: process.env.NODE_ENV === 'production' ?
    process.env.PORT :
    process.env.API_PORT,
  routes: {
    cors: true,
  },
});

server.register([{
  // logging
  register: require('good'),
},
  require('inert'),
{
  // api
  register: require('./api'),
  options: {},
  routes: {
    prefix: '/api/v1',
  },
}]);

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'build'
    }
  }
});

server.start(() => {
  console.log('Server running at:', server.info.uri);
});
