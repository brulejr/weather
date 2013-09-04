// module dependencies
var Hapi = require('hapi');
var appcfg = require("config").WEATHER;
var log4js = require('log4js');
var routes = require('./routes');

// configure logging
log4js.configure('log4js.json', {});

// configure server
var port = process.env.PORT || appcfg.defaultPort;
var hapicfg = {
  views: {
    engines: { jade: 'jade' },
    path: __dirname + '/views',
    compileOptions: {
      pretty: true
    }
  }
};
var server = new Hapi.Server(port, hapicfg);
server.addRoutes(routes);

// export application configuration
module.exports = server