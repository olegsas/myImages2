'use strict';

angular
  .module("MyApp", ['ui.router'])
  .controller('MainRootCtrl', ['$scope', '$state', '$stateParams',
   function($scope, $state, $stateParams) {
    //..
    var foo = $stateParams.foo; //getting fooVal
    var bar = $stateParams.bar; //getting barVal
    //..
    $scope.state = $state.current
    $scope.params = $stateParams; 
  }])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        
      $stateProvider
        .state('home', {
            url: 'home/:foo?bar',
            templateUrl: 'template.html',
            controller: 'MainRootCtrl'
        });

      $urlRouterProvider.otherwise('/');
    }
  ])
.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}])