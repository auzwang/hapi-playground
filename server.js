'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const HapiAccessChecker = require('@localz/hapi-access-checker');
const Boom = require('boom')

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'public')
    }
  }
});

const route = () => {
// Add the route
  server.route({
    method: 'get',
    path: '/',
    handler: (request, h) => {
      return Boom.badData('blah', { something: 'else' })
      return 'yo';
    }
  });

  server.route({
    method: 'get',
    path: '/{name}',
    handler: (request, h) => {
      return `hi ${encodeURIComponent(request.params.name)}`;
    }
  });

  // Static
  server.route({
    method: 'get',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
      }
    },
    options: {
      plugins: {
        accessChecker: {
          roles: [{
            name: "inventory:operator"
          }]
        },
      },
    }
  })

  // Additional data for errors
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (!response.isBoom)
      h.continue;

    const is4xx = response.output.statusCode >= 400 && response.output.statusCode < 500;
    if (is4xx && response.data)
      response.output.payload.data = response.data;

    return h.continue;
  });
};

const provision = async () => {
  try {
    await server.register(Inert);
    // await server.register([Inert, HapiAccessChecker]);
    // await server.register({plugin: HapiAccessChecker, options: {verifyDeviceEndpoint: 'test'}});
    route();
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

return provision();
