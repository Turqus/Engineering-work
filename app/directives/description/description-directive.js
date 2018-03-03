App.directive("description", () => {
    return {
        restrict: "E",
        templateUrl: '/directives/description/description-template.ejs',
        controller: ($scope, ApiService) => {
            $scope.toggleDesc = false;

            $scope.editDesc = (indexList, indexCard, desc) => { 
                $scope.board.lists[indexList].cards[indexCard].description = desc;

                var newDescripObj = {
                    idBoard: $scope.board._id,
                    indexList: indexList,
                    indexCard: indexCard,
                    descrip: $scope.board.lists[indexList].cards[indexCard]
                }

                $scope.toggleDesc = $scope.toggleDesc;
 
                return ApiService.card.addDescrip(newDescripObj);
            }
        }
    }
})