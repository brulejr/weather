/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Jon Brule
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

(function() {
	'use strict';

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
      path: __dirname + '/../../views',
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

}());