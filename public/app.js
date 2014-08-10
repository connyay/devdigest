(function() {
    'use strict';
    angular.module('thedigest', [])
        .controller('MainCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.loading = true;
                $http.get('/posts').success(function(posts){
                    $scope.posts = posts;
                    $scope.loading = false;
                });
            }
        ])
        .directive('loading', function() {
            return {
                restrict: 'E',
                template: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
            };
        });
})();
