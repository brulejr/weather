// module dependencies
var appcfg = require("config").WEATHER;
var cluster = require('cluster');
var control = require('strong-cluster-control');
var pjson = require('./package.json');
var server = require("./app-init");

var appname = pjson.name;
var numCPUs = appcfg.numCPUs || require('os').cpus().length;
var version = pjson.version;

if (cluster.isMaster) {

	console.log('Starting %s v%s (s) - %d workers', appname, version, numCPUs);
	control.start({
		size: numCPUs
	}).on('error', function(err){
    console.error(err);
	});

} else {

  // server instantiation
  server.start(function() {
    console.log("Worker #%d started on %s", cluster.worker.id, server.info.uri);
  });

}