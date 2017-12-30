App.directive("menuDeadline", function () {
    return {
        restrict: "E",
        templateUrl: '/directives/menu-deadline/menu-deadline-template.ejs',
        controller: function ($scope,ApiService) { 
            $scope.setDeadline = (term, indexList, indexCard) => {
                let dateObj = {};
                dateObj = {
                    date: new Date(term.date + 'T' + term.time),
                    idBoard: $scope.board._id,
                    indexList: indexList,
                    indexCard: indexCard
                }

                return ApiService.card.deadline(dateObj);
            }
        }
    }
})