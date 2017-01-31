angular.module('app.checkbox', ['ngFileUpload', 'bootstrapLightbox'])
    .controller('checkboxCtrl', function($scope, $http, Upload, Lightbox) {
       //console.log(Upload.upload);
        $scope.methods = {};
    $scope.images = [];

    $scope.$watch('file', function () {
        if ($scope.file != null) {
            Upload.upload({ url: '/image', data: { image: $scope.file } })
                .then(res => {
                    if (res.status = 200)
                        $scope.images.push({url: res.data})
                });
        }
    });

    $http.get('/images')
        .then(images => {
            images.data.forEach(img => {
                $scope.images.push({url: img})
            })
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
            console.log("index=" + index);
            console.log("$scope.images[0]" + $scope.images[0].url);
            Lightbox.openModal($scope.images, index);
        };

        $scope.deletePicture = function(index){
            console.log(index);
        };

    });



 