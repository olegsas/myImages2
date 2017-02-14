angular.module('app.home', ['ngFileUpload'])

.controller('homeCtrl', function($scope, $rootScope, $http, Upload, jwtHelper) {
    $scope.methods = {};
    $scope.images = [];
    $scope.users = [];
    $rootScope.name = nameJwt();
    if(nameJwt()) {
        $rootScope.profName = 'Profile ' + nameJwt();
    }
    

    
    function existJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if(jwtFull){
            return true; 
        } else {
            return false;
        }
    };

    function nameJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if (jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            return token.name; // we have username logged-in
        } else {
            return null;
        }    
    };

    function adminJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if(jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            return token.isAdmin; // if this user is admin
        } else {
            return null;
        }
    };



    if(!existJwt()){
    $http.get('/users/anonim')
        .then(users => {
            users.data.forEach(users => {
                $scope.users.push(users)
            });
        })
        .catch(err => console.log(err));
    } else {
        if(adminJwt()){ 
            $http.get('/users/admin')
                .then(users => {
                    users.data.forEach(users => {
                        $scope.users.push(users)
                    });
                })
                .catch(err => console.log(err));
            $http.get('/getIdFromSession')
                .then(id => {
                    $rootScope.userId = id.data.id;
                });
        } else {
            $http.get('/users/user')
                .then(users => {
                    users.data.forEach(users => {
                        $scope.users.push(users)
                    });
                })
                .catch(err => console.log(err));
            // we has the user if he is private
            $http.get('/users/anonim')
        .then(users => {
            users.data.forEach(users => {
                $scope.users.push(users)
            });
        })
        .catch(err => console.log(err));

        $http.get('/getIdFromSession')
                .then(id => {
                    $rootScope.userId = id.data.id;
                });

        }
    }

});