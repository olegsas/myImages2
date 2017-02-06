angular.module('app.users', ['ngFileUpload', 'bootstrapLightbox', 'ui.router'])
    .controller('usersCtrl', function($scope, $http, Upload, Lightbox, $uibModal, $stateParams) {
       console.log($stateParams.user_id);
       $scope.stateUser_id = $stateParams.user_id;
       //console.log(Upload.upload);
        $scope.methods = {};
    $scope.images = [];
    $scope.imagesForUsers = [];

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
            //
            // console.log("name.data = " + name.data.name);
            $scope.name = name.data.name;
        });
        
        $http.get('/getUserProfile')
        .then(public => {
            // console.log("public.data  =  " + public.data.public);
            $scope.public = public.data.public;
        });

        // we get all the pictures for the user/username
        // we have stateUsername!
        $http.get('/users/' + $scope.stateUser_id)
        .then(imagesForUsers => {
            $scope.imagesForUsers = imagesForUsers.data;//null;//images.data;

        });
        // question! How can we know that we have images for the certain user?

        $scope.update = function() {
        // console.log('====');
        //  console.log('$scope.public = ' + $scope.public);
         $http.post('/updateProfile', {public:$scope.public})
         .then(public => {
            // console.log('+++');
            // console.log("public.data.public = "+public.data.public);
             $scope.public = public.data.public;
         })          
         
        };

        // we use this function from the example
        $scope.openLightboxModal = function (index) {
            Lightbox.openModal($scope.images, index);
            // var obj = Lightbox.openModal($scope.images, index)
            // console.log(obj)
        };

        $scope.deletePicture = function(image, index){
            console.log("start");
            var body = document.querySelector('body');// we find the body selector
            angular.element(body).css('cursor', 'progress');
            $http.delete('/image/' + image._id)
                .then(res => {
                    $scope.images.splice(index, 1);
                    angular.element(body).css('cursor', 'default');
                })
                .catch(err => {});
            console.log("finish");
            // angular.element(body).css('cursor', 'default');
        };

    });
