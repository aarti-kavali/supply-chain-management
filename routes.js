const routes = require('next-routes')();

routes
    .add('/participant/:address/home', '/participant/home')
    .add('/participant/:address/')

module.exports = routes;