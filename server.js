'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000
});

// Add the route
server.route({
  method: 'get',
  path: '/',
  handler: (request, h) => {
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

// Start the server
async function start() {

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

start();
