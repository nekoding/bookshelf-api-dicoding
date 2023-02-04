const hapi = require('@hapi/hapi');
const routes = require('./routes');

const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const PORT = 9000;

(async () => {
  const server = hapi.server({
    port: PORT,
    host: HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();

  console.log(`Server berjalan pada port :${PORT}`);
})();
