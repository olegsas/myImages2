angular.module('app.checkbox', ['ngFileUpload', 'bootstrapLightbox'])
    .controller('checkboxCtrl', function($scope, $http, Upload, Lightbox, $uibModal) {
       //console.log(Upload.upload);
        $scope.methods = {};
    $scope.images = [];

    $scope.$watch('file', function () {
        console.log("$scope.file===================== "+$scope.file);
        console.log($scope.file);
        debugger;
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
        .catch(err => console.log(err))
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



 