angular.module('app.home', ['ngFileUpload'])

.controller('homeCtrl', function($scope, $http, Upload ) {
    $scope.methods = {};
    $scope.images = [];
    $scope.users = ['user1', 'user2', 'user3'];

    

    $http.get('/images')
        .then(images => {
            images.data.forEach(img => {
                $scope.images.push({url: img})
            })
        })
        .catch(err => console.log(err));

    $http.get('/users')
        .then(users => {
            users.data.forEach(users => {
                $scope.users.push({data: users})
            })
        })
        .catch(err => console.log(err))
});