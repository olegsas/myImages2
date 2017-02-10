angular.module('app.auth', [])

.factory('AuthService', function ($http) {
    const auth = {};

    auth.register = async function (email, name, password) {
        let res = await $http.post('/register', {
            email: email,
            name: name,
            password: password
        })
        window.localStorage['jwt'] = angular.toJson(res.data.token)
    }

    auth.login = async function (email, password) {
        let res = await $http.post('/login', {
            email: email,
            password: password
        });
        window.localStorage['jwt'] = angular.toJson(res.data.token)
    }

    auth.isAuthenticated = function () {
        return window.localStorage.getItem('jwt') ? true : false
    }

    auth.logout = async function () {
        await $http.get('/logout')
        window.localStorage.removeItem('jwt');
    }

    return auth;
})

.controller('authCtrl', function($scope, $rootScope, $http, $state, AuthService) {
    $scope.login = async function() {
        await AuthService.login($scope.username, $scope.password);
        $rootScope.name = 'namme';
        $state.transitionTo('home')
        
    }

    $scope.register = async function() {
        await AuthService.register($scope.email, $scope.username, $scope.password);
        $state.transitionTo('home')
    }
})