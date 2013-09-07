var config = require("config").WEATHER;
var rest = require('rest');
var mime = require('rest/interceptor/mime');
var errorCode = require('rest/interceptor/errorCode');
var util = require('util');

var client = rest.chain(mime)
                 .chain(errorCode, { code: 500 });

exports.currentWeather = function(latitude, longitude, request) {
  var api = util.format(config.ForcastApiUrl, config.ForcastApiKey, latitude, longitude);
  client({ path: api }).then(
    function(response) {
      var data = response.entity;
      request.reply({
        "latitude": latitude,
        "longitude": longitude,
        "timezone": data.timezone,
        "time": data.currently.time,
        "summary": data.currently.summary,
        "icon": data.currently.icon,
        "precipIntensity": data.currently.precipIntensity,
        "precipProbability": data.currently.precipProbability,
        "temperature": data.currently.temperature,
        "apparentTemperature": data.currently.apparentTemperature,
        "dewPoint": data.currently.dewPoint,
        "windSpeed": data.currently.windSpeed,
        "windBearing": data.currently.windBearing,
        "cloudCover": data.currently.cloudCover,
        "humidity": data.currently.humidity,
        "pressure": data.currently.pressure,
        "visibility": data.currently.visibility,
        "ozone": data.currently.ozone
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
