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
		closable : false
	} ];

  var addNewTab = function(data) {
    console.log(data);
    for (var i = 0; i < $scope.tabs.length; i++) { 
    	if ($scope.tabs[i].id == data.id) {
    		$scope.tabs[i].active = true;
    		return;
    	}
    }
    $scope.tabs.push({
    	id: data.id,
      title : 'Weather - ' + data.id,
      template : '/view/weatherTab',
      closable : true,
      active: true
    });
  };

	$scope.removeTab = function(index) {
		$scope.tabs.splice(index,1);
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

  $scope.getWeatherFromCoords = function submit() {
  	var criteria = $scope.criteria;
  	var key = criteria.latitude + ',' + criteria.longitude;
  	WeatherAPI.one(WeatherUri, key).get().then(function(response){
  		var $scope = angular.element(document).scope();
  		$scope.$broadcast('CurrentWeatherEvent', response.data); 
  	},function(response) {
      console.log("Error with status code", response.status);
    });
  };

});
