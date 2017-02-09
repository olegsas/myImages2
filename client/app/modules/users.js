angular.module('app.users', ['ngFileUpload', 'bootstrapLightbox', 'ui.router', 'angular-jwt'])
    .controller('usersCtrl', function($scope, $http, Upload, Lightbox, $uibModal, $stateParams, jwtHelper) {
       console.log($stateParams.user_id);
       $scope.stateUser_id = $stateParams.user_id;
       //console.log(Upload.upload);
        $scope.methods = {};
    $scope.images = [];
    $scope.imagesForUsers = [];

    function nameJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if (jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            console.log("===============" + token.name);
            return token.name; // we have username logged-in
        } else {
            return null;
        }    
    }

    function isAdminJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if(jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            console.log("tokenAdmin = " + token.isAdmin);
            return token.isAdmin; // if this user is admin
        } else {
            return null;
        }
    }

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
        
        
        
        //
        
        $http.get('/getUsernameForId/'+$scope.stateUser_id)
            .then(nameForId => {    
                //debugger;
                $scope.nameForId = nameForId.data.name;
                console.log("NNName for Id = " + $scope.nameForId);
            });
        // we need to find username for this _id

        $scope.name = nameJwt();//
        console.log("scope.name.jwt = " + $scope.name);
        
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
            // we want to know username for this id of the user
            

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

        $scope.userLoggedIn = function(name, nameForId){
            return ($scope.name === $scope.nameForId)
        };

        $scope.userOwnerOrAdmin = function() {
            console.log("ifUserOrAdmin = " + (($scope.name === $scope.nameForId) || (isAdminJwt())));
            return (($scope.name === $scope.nameForId) || (isAdminJwt()))
        };

        $scope.showPublic = function() {
            return $scope.public;
        };

    });

    //console.log("userOwnerOrAdmin = " + $scope.userOwnerOrAdmin());
