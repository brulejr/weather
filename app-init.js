// module dependencies
var config = require("config").WEATHER;
var express = require('express');
var lingua  = require('lingua');
var log4js = require('log4js');
var path = require('path');
var pjson = require('./package.json');
var routes = require('./routes');

// configure logging
log4js.configure('log4js.json', {});

// all environments
var app = express();
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.locals.appname = pjson.name
	app.locals.config = config;
	app.locals.env = app.get('env');
	app.locals.license = pjson.license
	app.locals.version = pjson.version

  app.use(lingua(app, {
		defaultLocale: 'en',
		path: __dirname + '/i18n'
  }));

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// route configuration
app.get('/', routes.index);
app.get('/view/:view', routes.view);

// export application configuration
module.exports = app;
