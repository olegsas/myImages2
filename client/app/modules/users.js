angular.module('app.users', ['ngFileUpload', 'bootstrapLightbox', 'ui.router', 'angular-jwt'])
.controller('usersCtrl', function($scope, $rootScope, $http, Upload, Lightbox, $uibModal, $stateParams, jwtHelper) {
    $rootScope.userr = $stateParams.user_id;
    $scope.stateUser_id = $stateParams.user_id;
    $scope.methods = {};
    $scope.images = [];
    $scope.imagesForUsers = [];

    function nameJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if (jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            return token.name; // we have username logged-in
        } else {
            return null;
        }    
    }

    function isAdminJwt() {
        var jwtFull = window.localStorage.getItem('jwt');
        if(jwtFull){
            var token = jwtHelper.decodeToken(jwtFull);
            return token.isAdmin; // if this user is admin
        } else {
            return null;
        }
    };

    
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            var body = document.querySelector('body');// we find the body selector
            angular.element(body).css('cursor', 'progress');
            if($scope.name !== "admin") {
                Upload.upload({ url: '/image', data: { image: $scope.file } })
                    .then(res => {
                        if (res.status = 200) {
                            $scope.images.push({url: res.data});
                            angular.element(body).css('cursor', 'default');
                        }
                    });
            } else {
                Upload.upload({ url: '/imageUploadAdmin', data: { 'image': $scope.file, 'user_id': $scope.stateUser_id}})
                    .then(res => {
                        if (res.status = 200) {
                            $scope.images.push({url: res.data});
                            angular.element(body).css('cursor', 'default');
                        }
                    });
            }
        }
    });

    
    
    $http.get('/getUsernameForId/'+$scope.stateUser_id)
        .then(nameForId => {    
        	//debugger;
        $scope.nameForId = nameForId.data.name;})
        .then(function(){
            if($scope.name === $scope.nameForId) { // user owner
                $http.get('/images')
                    .then(res => {
                        $scope.images = res.data;
                    });
                    // .catch(err => console.log(err));
            }
        }).then(function(){
            if((!!$scope.name) || ($scope.name !== $scope.nameForId)) { // guest or anonim user
                $http.get('/imagesId/' + $scope.stateUser_id)
                    .then(res => {
                        $scope.images = res.data;
                    });
                    // .catch(err => console.log(err));
            }
        }).then(function(){
            if($scope.name === "admin"){
                $http.get('/imagesId/' + $scope.stateUser_id)
                    .then(res => {
                        $scope.images = res.data;
                    });
                    // .catch(err => console.log(err));
            }
        });
        
        
    
    

    $scope.openModal = function (img) {
        var modalInstance = $uibModal.open({
            template : `<img ng-src="`+ img +`"></img>`
        })

    };
    
    
        
        
        
        
    

    $scope.name = nameJwt();//
    $rootScope.name = $scope.name;
        
    $http.get('/getUserProfile')
        .then(public => {
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
        $http.post('/updateProfile', {public:$scope.public})
        	.then(public => {
             $scope.public = public.data.public;
         	})          
         
    };

    $scope.updateForId = function() {
        // update user checkbox by Admin
        $http.post('/updateProfileForId/' + $scope.stateUser_id, {public: $scope.publicForId})
            .then(public => {
                $scope.publicForId = public.data.public;
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
    };

    $scope.deletePictureByAdmin = function(image, index) {
        var body = document.querySelector('body');
        angular.element(body).css('cursor', 'progress');
        $http.delete('/image/' + image._id)
            .then(res => {
                $scope.images.splice(index, 1);
                angular.element(body).css('cursor', 'default');
            }).catch(err =>{});

    };


    $scope.userOwnerOrAdmin = function() {
        return (($scope.name === $scope.nameForId) || (isAdminJwt()))
    };

    $scope.userOwner = function() {
        return ($scope.name === $scope.nameForId);
    };

    $scope.userAdmin = function() {
        return ((isAdminJwt()) && ($scope.name !== $scope.nameForId))
    };

    $scope.showPublic = function() {
        return $scope.public;
    };


    if(isAdminJwt()){ 
        $http.get('/getUserProfileForId/' + $scope.stateUser_id)
            .then(profile => {
                $scope.publicForId = profile.data.public;
            });
            // .catch(err => console.log(err));
    };

    $scope.showPublicForId = function() {
        return $scope.publicForId;
    }


});

    
