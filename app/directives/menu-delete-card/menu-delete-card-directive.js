App.directive("menuDeleteCard", function() {
    return {
        restrict: "E",
		templateUrl: '/directives/menu-delete-card/menu-delete-card-template.ejs',
        controller: function($scope, ApiService) {
            $scope.deleteCard = (indexList, indexCard) => {
                $scope.board.lists[indexList].cards.splice(indexCard, 1);
  
                let modalWindow = document.querySelector(".modal-backdrop");
                modalWindow.classList.remove("modal-backdrop"); 

                let deleteCardObj = {
                    idBoard: $scope.board._id,
                    indexList: indexList,
                    lists: $scope.board.lists[indexList].cards
                }

                return ApiService.card.deleteCard(deleteCardObj);
            }
        }
    }
})