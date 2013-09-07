// module dependencies
var appcfg = require("config").WEATHER;
var cluster = require('cluster');
var control = require('strong-cluster-control');
var pjson = require('./package.json');
var server = require("./app-init");

var appname = pjson.name;
var version = pjson.version;

// server instantiation
server.start(function() {
  console.log('Starting %s v%s (s) on ', appname, version, server.info.uri);
});
