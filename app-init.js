// module dependencies
var Hapi = require('hapi');
var appcfg = require("config").WEATHER;
var log4js = require('log4js');
var routes = require('./routes');

var configureLout = function(server) {
	server.pack.require({
		lout : {
			endpoint : '/docs'
		}
	}, function(err) {
		if (err) {
			console.log('Failed loading plugins');
		}
	});
};

var configureTv = function(server) {
	var debugPort = process.env.DEBUG_PORT || appcfg.debugPort;
	var tvOptions = {
		webSocketPort : debugPort,
		debugEndpoint : '/debug/console',
		queryKey : 'debug'
	};
	server.pack.require('tv', tvOptions, function(err) {
		if (!err) {
			server.log([ 'info', 'tv' ], 'Loaded plugin');
		} else {
			server.log([ 'error', 'tv' ], 'Failed loading plugin: ' + err.message);
		}
	});
};


// configure logging
log4js.configure('log4js.json', {});

// configure server
var hapicfg = {
  views: {
    engines: { jade: 'jade' },
    path: __dirname + '/views',
    compileOptions: {
      pretty: true
    }
  }
};
var serverPort = process.env.PORT || appcfg.serverPort;
var server = new Hapi.Server('0.0.0.0', serverPort, hapicfg);
configureLout(server);
// configureTv(server);
server.addRoutes(routes);

// export application configuration
module.exports = server