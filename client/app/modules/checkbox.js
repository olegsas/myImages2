angular.module('app.checkbox', ['ngFileUpload', 'bootstrapLightbox', 'ui.router'])
    .controller('checkboxCtrl', function($scope, $http, Upload, Lightbox, $uibModal, $stateParams) {
        $scope.methods = {};
    $scope.images = [];

    $scope.$watch('file', function () {
        if ($scope.file != null) {
            var body = document.querySelector('body');// we find the body selector
            angular.element(body).css('cursor', 'progress');
            Upload.upload({ url: '/image', data: { image: $scope.file } })
                .then(res => {
                    if (res.status = 200) {
                        $scope.images.push({url: res.data});
                        angular.element(body).css('cursor', 'default');
                    }
                });
        }
    });


    $scope.openModal = function (img) {
        var modalInstance = $uibModal.open({
            template : `<img ng-src="`+ img +`"></img>`
        })

    }
    $http.get('/images')
        .then(images => {
            $scope.images = images.data;
            // images.data.forEach(img => {
            //     $scope.images.push({url: img})
            // })
        })
        .catch(err => console.log(err));
// I borrowed the code above the line from the controller home.js
        
        $http.get('/getUserName')
        .then(name => {
            $scope.name = name.data.name;
        });
        
        $http.get('/getUserProfile')
        .then(public => {
            $scope.public = public.data.public;
        });

        $scope.update = function() {
         $http.post('/updateProfile', {public:$scope.public})
         .then(public => {
             $scope.public = public.data.public;
         })          
         
        };

        // we use this function from the example
        $scope.openLightboxModal = function (index) {
            Lightbox.openModal($scope.images, index);
        };

        $scope.deletePicture = function(image, index){
            var body = document.querySelector('body');// we find the body selector
            angular.element(body).css('cursor', 'progress');
            $http.delete('/image/' + image._id)
                .then(res => {
                    $scope.images.splice(index, 1);
                    angular.element(body).css('cursor', 'default');
                })
                .catch(err => {});
            // angular.element(body).css('cursor', 'default');
        };

    });



 