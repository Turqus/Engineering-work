App.directive("menuDeadline", function () {
    return {
        restrict: "E",
        templateUrl: '/directives/menu-deadline/menu-deadline-template.ejs',
        controller: function ($scope,ApiService) { 
            var today = new Date();
            var getDay = today.getDate();
            var getMonth = today.getMonth()+1;
            var getYear = today.getFullYear();
    
            $scope.term = {};
            $scope.term.date = `${getYear}-${getMonth}-${getDay}`;
            $scope.term.time = `12:00`;
            
            $scope.setDeadline = (term, indexList, indexCard) => {
                let dateObj = {
                    date: new Date(term.date + 'T' + term.time),
                    idBoard: $scope.board._id,
                    indexList: indexList,
                    indexCard: indexCard
                }
                
                $scope.board.lists[indexList].cards[indexCard].deadline = dateObj.date;

                return ApiService.card.deadline(dateObj);
            }
        }
    }
})