angular.module('app', [
    'app.home',
    'app.profile',
    'app.auth',
    'ui.router',
    'ngAnimate',
    'thatisuday.ng-image-gallery',
    'ngFileUpload',
    'app.checkbox',
    'app.modalWindow',
    'app.users',
    'angular-jwt'
])

.run(['$rootScope', '$state', '$stateParams', 'AuthService',
    function ($rootScope, $state, $stateParams, AuthService) {
        var user_id = $stateParams.user_id; // getting username
        console.log($stateParams);
        console.log("user_id = " + user_id);
        $rootScope.$on("$stateChangeStart", async function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !AuthService.isAuthenticated()) {
                // User isn’t authenticated
                event.preventDefault();
                $state.transitionTo("login");
            }
        });
    }
])

.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl',
                authenticate: false
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                controller: 'profileCtrl',
                authenticate: true
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'authCtrl',
                authenticate: false
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'authCtrl',
                authenticate: false
            })
            .state('users', {
                url: '/users/{user_id}',
                templateUrl: 'templates/users.html',
                controller: 'usersCtrl',
                authenticate: false
            })

    }
])

.controller('AppCtrl', function ($rootScope, $scope, $state, AuthService) {
    $scope.authenticated = AuthService.isAuthenticated();

    $scope.logout = async function () {
        await AuthService.logout()
        $scope.authenticated = false;
        $rootScope.profName = '';
        $rootScope.name = '';
        $rootScope.userId = '';
        $state.transitionTo('login')
    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $scope.authenticated = AuthService.isAuthenticated();
    });
})