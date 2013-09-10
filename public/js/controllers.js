'use strict';

var controllers = angular.module('app.controllers', [ 'restangular' ]);

controllers.controller('PageCtrl', function($scope, $dialog) {

  $scope.$on('CurrentWeatherEvent', function(event, data) {
    addNewTab(data);
  });

	$scope.tabs = [ {
		id: 'HOME',
		title : 'Home',
		template : '/view/homeTab',
		closable : false,
		weather: { }
	} ];

	$scope.currentWeather = { };

  $scope.select = function(tab) {
    $scope.currentWeather = tab.weather;
  };

  var addNewTab = function(data) {
    for (var i = 0; i < $scope.tabs.length; i++) { 
    	if ($scope.tabs[i].id == data.id) {
    		$scope.tabs[i].active = true;
    		$scope.tabs[i].weather = angular.copy(data);
    		$scope.currentWeather = $scope.tabs[i].weather;
    		return;
    	}
    }
    $scope.tabs.push({
    	id: data.id,
      title : 'Weather - ' + data.id,
      template : '/view/weatherTab',
      closable : true,
      active: true,
      weather: angular.copy(data)
    });
    $scope.currentWeather = angular.copy(data);
  };

	$scope.removeTab = function(index) {
		$scope.tabs.splice(index, 1);
	};

	$scope.openAboutDialog = function() {
		var d = $dialog.dialog({
			backdrop: true,
      keyboard: true,
      backdropClick: true,
      templateUrl: '/view/about'
		});
		d.open();
	};
  
  $scope.closeDialog = function(result) {
    dialog.close(result);
  };	

});

controllers.constant('WeatherUri', 'weather');
controllers.controller('WeatherCtrl', function($scope, WeatherAPI, WeatherUri) {

  var cityCriteriaMaster = {};
  var coordCriteriaMaster = {};

  $scope.cityCriteria = {};
  $scope.coordCriteria = {};

  $scope.getWeatherForCity = function submit() {
    cityCriteriaMaster = angular.copy($scope.cityCriteria);
  }

  $scope.getWeatherForCoords = function submit() {
    coordCriteriaMaster = angular.copy($scope.coordCriteria);
  	var key = $scope.coordCriteria.latitude + ',' + $scope.coordCriteria.longitude;
  	WeatherAPI.one(WeatherUri, key).get().then(function(response){
  		var $scope = angular.element(document).scope();
  		$scope.$broadcast('CurrentWeatherEvent', response.data); 
  	},function(response) {
      console.log("Error with status code", response.status);
    });
  };

  $scope.isCityCriteriaUnchanged = function() {
    return angular.equals($scope.cityCriteria, cityCriteriaMaster);
  };

  $scope.isCoordCriteriaUnchanged = function() {
    return angular.equals($scope.coordCriteria, coordCriteriaMaster);
  };

  $scope.resetCityCriteria = function(form) {
    $scope.cityCriteria = angular.copy(cityCriteriaMaster);
    resetField(form['city']);
    resetField(form['state']);
  };

  $scope.resetCoordCriteria = function(form) {
    $scope.coordCriteria = angular.copy(coordCriteriaMaster);
    resetField(form['latitude']);
    resetField(form['longitude']);
  };

  var resetField = function(field) {
      field.$pristine = true;
      field.$dirty = false;
  };

  $scope.CitySearchAccordion = false;
  $scope.CoordSearchAccordion = true;

});
