//angular module
var app = angular.module('GestorUI', ['treeControl', 'ngResource']);

app.factory("Book", function($resource) {
    return $resource("/getBibliography");
});

app.controller("bibliographyController", function($scope, Book) {
    Book.get(function(data) {
        $scope.roleList = data;
    });
});