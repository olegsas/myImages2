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
          views: {
            '': {
              templateUrl: 'tpl.home.html',
              controller: 'MainRootCtrl'

            },

            'A@home': {
              templateUrl: 'tpl.a.html',
              //controller: 'MainCtrl'
            },

            'B@home': {
              templateUrl: 'tpl.b.html',
              //controller: 'SomeController'
            }
          }

        });
        

      $stateProvider
        .state('other', {
          url: '/other/:foo?bar',
          params: { 
            // here we define default value for foo
            // we also set squash to false, to force injecting
            // even the default value into url
            foo: {
              value: 'defaultValue',
              squash: false,
            },
            // this parameter is now array
            // we can pass more items, and expect them as []
            bar : { 
              array : true,
            },
            // this param is not part of url
            // it could be passed with $state.go or ui-sref 
            hiddenParam: 'YES',
          },
          templateUrl: 'tpl.html',
        })

      $urlRouterProvider.otherwise('/');
    }
  ])
.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}])