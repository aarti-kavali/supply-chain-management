const routes = require('next-routes')();

routes
    .add('/participant/:address', '/participant/home')
    .add('/participant/:address/manufacture', '/participant/manufacture')
    .add('/participant/:address/shipment', '/participant/shipment')
    .add('/participant/:address/transfer', '/participant/transfer')

module.exports = routes;