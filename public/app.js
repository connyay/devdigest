(function() {
    'use strict';
    angular.module('thedigest', [])
        .controller('MainCtrl', ['$scope', '$http',
            function($scope, $http) {
                $http.get('/posts').success(function(posts){
                    $scope.posts = posts;
                });
            }
        ]);
})();
