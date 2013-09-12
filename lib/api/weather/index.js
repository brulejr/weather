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

  var config = require("config").WEATHER;
  var rest = require('rest');
  var mime = require('rest/interceptor/mime');
  var errorCode = require('rest/interceptor/errorCode');
  var util = require('util');

  var client = rest.chain(mime)
                   .chain(errorCode, { code: 500 });

  var selectUnits = function(units, us, si, ca, uk) {
    if (units == "us") {
      return us;
    } else if (units == "ca") {
      return angular.isDefined(ca) ? ca : si;
    } else if (units == "uk") {
      return angular.isDefined(uk) ? uk : si;
    } else {
      return si;
    }
  }

  var degToCompass = function(degrees) {
    var words = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return words[Math.round(degrees / 22.5) % 16];
  }

  exports.currentWeather = function(latitude, longitude, request) {
    var api = util.format(config.ForcastApiUrl, config.ForcastApiKey, latitude, longitude);
    client({ path: api }).then(
      function(response) {
        var data = response.entity;
        var units = data.flags.units;
        request.reply({
          "id": latitude + "," + longitude,
          "latitude": latitude,
          "longitude": longitude,
          "timezone": data.timezone,
          "time": new Date(data.currently.time).toTimeString(),
          "summary": data.currently.summary,
          "icon": data.currently.icon,
          "precipIntensity": {
            "value": data.currently.precipIntensity,
            "units": selectUnits(units, "in/h", "mm/h")
          },
          "precipProbability": {
            "value": Math.round(data.currently.precipProbability * 100),
            "units": "%"
          },
          "temperature": {
            "value": data.currently.temperature,
            "units": selectUnits(units, "F", "C")
          },
          "apparentTemperature": {
            "value": data.currently.apparentTemperature,
            "units": selectUnits(units, "F", "C")
          },
          "dewPoint": {
            "value": data.currently.dewPoint,
            "units": selectUnits(units, "F", "C")
          },
          "windSpeed": {
            "value": data.currently.windSpeed,
            "units": selectUnits(units, "mph", "mps", "kph", "mph")
          },
          "windBearing": degToCompass(data.currently.windBearing),
          "cloudCover": data.currently.cloudCover,
          "humidity": {
            "value": Math.round(data.currently.humidity * 100),
            "units": "%"
          },
          "pressure": {
            "value": data.currently.pressure,
            "units": selectUnits(units, "mb", "mb")
          },
          "visibility": {
            "value": data.currently.visibility,
            "units": selectUnits(units, "mi", "km")
          },
          "ozone": {
            "value": data.currently.ozone,
            "units": "Dobson"
          }
        });
      },
      function(response) {
        console.log(response);
        request.reply({
          "latitude": latitude,
          "longitude": longitude,
          "message": "Unable to retrieve weather due to an error"
        });
      }
    );
  };

}());