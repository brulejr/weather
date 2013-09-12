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
  var i18n = require('i18next');
  var geocode = requireLib('/api/geocode');
  var pkginfo = require('pkginfo')(module);
  var weather = requireLib('/api/weather');

  // configure i18n
  i18n.init({
	  lng: 'en-US',
	  fallbackLng: 'en-US',
    debug: false,
	  ns: 'messages',
	  resGetPath: 'i18n/__lng__/__ns__.json' 
  });

  // configure metadata passed to views
  var viewMetadata = JSON.parse(JSON.stringify(module.exports));
  viewMetadata.env = process.env.NODE_ENV || 'DEV';
  viewMetadata.t = i18n.t;

  var rootHandler = function (request) {
    request.reply.view('index', viewMetadata);
  };

  var viewHandler = function (request) {
    request.reply.view('client/' + request.params.view, viewMetadata);
  };

  var weatherHandler = function (request) {
    var parts = request.params.coordinates.split(',');
    var latitude = parts[0];
    var longitude = parts[1];
    weather.currentWeather(latitude, longitude, request);
  };

  module.exports = [
      { method: 'GET', path: '/', config: { handler: rootHandler } },
      { method: 'GET', path: '/api/v1/weather/{coordinates}', config: {  handler: weatherHandler }},
      { method: 'GET', path: '/view/{view}', config: { handler: viewHandler } },
      { method: 'GET', path: '/{path*}', config: { 
    	  handler: {  directory: { path: './public', listing: false, index: false } } 
      }}
  ];

}());