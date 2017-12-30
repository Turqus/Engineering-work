App.directive("menuCopyCard", function() {
    return {
        restrict: "E",
		templateUrl: '/directives/menu-copy-card/menu-copy-card-template.ejs',
        controller: function($scope, ApiService) {
            $scope.copyCard = (nameNew, status, selectedBoard, selectedList) => {
                console.log(nameNew, status, selectedBoard, selectedList)
            }
        }
    }
})