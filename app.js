// module dependencies
var app = require("./app-init");
var cluster = require('cluster');
var control = require('strong-cluster-control');
var http = require('http');

var appname = app.locals.appname;
var env = app.locals.env;
var numCPUs = app.locals.config.numCPUs || require('os').cpus().length;
var port = app.get('port');
var version = app.locals.version;

if (cluster.isMaster) {

	console.log('Starting %s v%s (s) - %d workers', appname, version, numCPUs);
	control.start({
		size: numCPUs
	}).on('error', function(err){
    console.error(err);
	});

} else {

  // server instantiation
  http.createServer(app).listen(port, function() {
    console.log('Worker #%d listening on port %d', cluster.worker.id, port);
  });

}