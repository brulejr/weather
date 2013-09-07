'use strict';

var controllers = angular.module('app.controllers', [ 'restangular' ]);

controllers.controller('PageCtrl', function($scope, $dialog) {

	$scope.tabs = [ {
		title : "Home",
		template : "/view/home",
		enabled : true,
		closable : false
	}, {
		title : "Thing",
		template : "/view/thing",
		enabled : true,
		closable : true
	} ];

	$scope.enabledTab = function() {
		return function(friend) {
			return friend.enabled;
		};
	};

	$scope.removeTab = function(index) {
		$scope.tabs[index].enabled = false;
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

  $scope.criteria = {
    latitude: '',
    longitude: ''
  };

  $scope.currentWeather = {};

  $scope.getWeatherFromCoords = function submit() {
  	var criteria = $scope.criteria;
  	var key = criteria.latitude + ',' + criteria.longitude;
  	WeatherAPI.one(WeatherUri, key).get().then(function(response){
  		$scope.currentWeather = response.data;
  		var data = response.data;
  	  console.log($scope.currentWeather);
  	},function(response) {
      console.log("Error with status code", response.status);
    });
  };

});
