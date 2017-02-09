angular.module('app.home', ['ngFileUpload'])

.controller('homeCtrl', function($scope, $http, Upload, jwtHelper) {
    $scope.methods = {};
    $scope.images = [];
    $scope.users = [];

    
    function existJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if(jwtFull){
            return true; 
        } else {
            return false;
        }
    };

    function adminJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if(jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            console.log("tokenAdmin = " + token.isAdmin);
            return token.isAdmin; // if this user is admin
        } else {
            return null;
        }
    };



    if(!existJwt()){
    $http.get('/users/anonim')
        .then(users => {
            console.log("We get users==============================");
            users.data.forEach(users => {
                $scope.users.push(users)
            });
        })
        .catch(err => console.log(err));
    } else {
        if(adminJwt()){
            // admin logged in
            console.log("Admin loggggggggggggggggggggg");
            $http.get('/users/admin')
                .then(users => {
                    users.data.forEach(users => {
                        $scope.users.push(users)
                    });
                })
                .catch(err => console.log(err));
        } else {
            // user logged in
        }
    }

});