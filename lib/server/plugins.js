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
  var appcfg = require("config").WEATHER;

  // configure RESTful API docs endpoint
  exports.configureLout = function(server) {
    server.pack.require({
      lout : {
        endpoint : '/docs'
      }
    }, function(err) {
      if (err) {
        var msg = 'Plugin Load Failure - lout : ' + err.message;
        console.error(msg);
        server.log([ 'error', 'lout' ], msg);
      } else {
        var msg = "Plugin Load Success - lout";
        console.log(msg);
        server.log([ 'info', 'lout' ], msg);
      }
    });
  };

  // configure debugging server
  exports.configureTv = function(server) {
    var debugPort = process.env.DEBUG_PORT || appcfg.debugPort;
    var tvOptions = {
      webSocketPort : debugPort,
      debugEndpoint : '/debug/console',
      queryKey : 'debug'
    };
    server.pack.require('tv', tvOptions, function(err) {
      if (err) {
        var msg = 'Plugin Load Failure - tv : ' + err.message;
        console.error(msg);
        server.log([ 'error', 'tv' ], msg);
      } else {
        var msg = "Plugin Load Success - tv";
        console.log(msg);
        server.log([ 'info', 'tv' ], msg);
      }
    });
  };

}());