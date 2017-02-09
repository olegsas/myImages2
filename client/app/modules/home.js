angular.module('app.home', ['ngFileUpload'])

.controller('homeCtrl', function($scope, $http, Upload ) {
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
    }

    if(!existJwt()){
    $http.get('/users/anonim')
        .then(users => {
            console.log("We get users==============================");
            users.data.forEach(users => {
                $scope.users.push(users)
            });
        })
        .catch(err => console.log(err));
    }

});