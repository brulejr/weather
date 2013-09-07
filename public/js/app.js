'use strict';

var appModule = angular.module('app', [ 
	'app.controllers',
	'app.directives',
	'app.filters',
	'restangular',
	'smartTable.table',
	'ui.bootstrap', 
	'ui.utils',
]);

appModule.factory('WeatherAPI', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl('/api/v1');
    RestangularConfigurer.setResponseExtractor(function(response) {
      var newResponse = response;
      if (angular.isArray(response)) {
        angular.forEach(newResponse, function(value, key) {
          newResponse[key].originalElement = angular.copy(value);
        });
      } else {
        newResponse.data = angular.copy(response);
      }
      return newResponse;
    });    
  });
});