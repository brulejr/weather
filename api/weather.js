var config = require("config").WEATHER;
var rest = require('rest');
var mime = require('rest/interceptor/mime');
var errorCode = require('rest/interceptor/errorCode');
var util = require('util');

var client = rest.chain(mime)
                 .chain(errorCode, { code: 500 });

function getWeather(latitude, longitude, res) {
  var api = util.format(
    'https://api.forecast.io/forecast/%s/%s,%s', 
    config.ForcastApiKey, latitude, longitude);
  client({ path: api }).then(
    function(response) {
      var data = response.entity;
      res.send({
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
      res.send({
        "latitude": latitude,
        "longitude": longitude,
        "message": "Unable to retrieve weather due to an error"
      });
    }
  );
};

// current weather
exports.currentWeather = function(req, res) {
	var longitude = req.params.longitude;
	var latitude = req.params.latitude;
	getWeather(latitude, longitude, res);
};
