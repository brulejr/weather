'use strict';

var directives = angular.module('app.directives', []);

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
directives.directive('smartFloat', function() {
	console.log('smartFloat');
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (FLOAT_REGEXP.test(viewValue)) {
          ctrl.$setValidity('float', true);
          return parseFloat(viewValue.replace(',', '.'));
        } else {
          ctrl.$setValidity('float', false);
          return undefined;
        }
      });
    }
  };
});