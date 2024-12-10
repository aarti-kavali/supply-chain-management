const next = require('next');
const http = require('http');
const routes = require('./routes');

const app = next({
  dev: process.env.NODE_ENV !== 'production',
});

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handler(req, res); // Pass requests to the handler
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('Ready on localhost:3000');
  });
});
