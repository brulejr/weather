var mainModule = angular.module('main', [  'ui.bootstrap', 'ui.utils', 'smartTable.table' ]);

mainModule.controller('PageCtrl', function($scope, $dialog) {

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
