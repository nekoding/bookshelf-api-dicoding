const hapi = require('@hapi/hapi');
const routes = require('./routes');

(async () => {
  const server = hapi.server({
    port: 5000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
})();
