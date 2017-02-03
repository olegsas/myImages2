angular.module('app.home', ['ngFileUpload'])

.controller('homeCtrl', function($scope, $http, Upload ) {
    $scope.methods = {};
    $scope.images = [];
    $scope.users = [];

    

    $http.get('/images')
        .then(images => {
            images.data.forEach(img => {
                $scope.images.push({url: img})
            })
        })
        .catch(err => console.log(err));

    $http.get('/users')
        .then(users => {
            console.log("We get users==============================");
            users.data.forEach(users => {
                $scope.users.push(users)
            });
        })
        .catch(err => console.log(err))
});