function BibliographyController($scope, Book) {
    Book.get(function(data) {
        $scope.roleList = data;
    });
};