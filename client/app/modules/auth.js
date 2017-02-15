angular.module('app.auth', ['angular-jwt'])

.factory('AuthService', function ($http, $rootScope, $state) {
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
        // debugger;
        try {
            let res = await $http.post('/login', {
                email: email,
                password: password
            });
        window.localStorage['jwt'] = angular.toJson(res.data.token);
    } catch(e) {
            $rootScope.alert = e.data.message;
            $state.transitionTo('login');
            $state.transitionTo('users');
            $state.transitionTo('login');
        }

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

.controller('authCtrl', function($scope, $rootScope, $http, $state, AuthService, jwtHelper) {
    function nameJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if (jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            return token.name; // we have username logged-in
        } else {
            return null;
        }    
    };
    $scope.login = async function() {
        await AuthService.login($scope.username, $scope.password);
        if(nameJwt()) {
            $rootScope.profName = 'Profile ' + nameJwt();
            $state.transitionTo('home');
    };
        $rootScope.name = nameJwt();
        
        
    }

    $scope.register = async function() {
        await AuthService.register($scope.email, $scope.username, $scope.password);
        $state.transitionTo('home')
    }

    $rootScope.alertF = function() {
        console.log("!!$rootScope.alert = " + !!$rootScope.alert)
        return !!$rootScope.alert;

    }
})