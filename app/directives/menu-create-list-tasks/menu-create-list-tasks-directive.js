App.directive("menuAddListTasks", function() {
    return {
        restrict: "E",
        controller: function() {
            $scope.addListOfTasks = (indexList, indexCard, nameList) => {
                if ($scope.board.lists[indexList].cards[indexCard].listsTasks == undefined)
                    $scope.board.lists[indexList].cards[indexCard].listsTasks = [];
        
                $scope.board.lists[indexList].cards[indexCard].listsTasks.push({ 'name': nameList, 'percent': '0' });
        
                var listsTasksObj = {
                    type: 'name',
                    idBoard: $scope.board._id,
                    indexList: indexList,
                    indexCard: indexCard,
                    tasks: $scope.board.lists[indexList].cards[indexCard].listsTasks
                }
        
                return ApiService.staff.addListsOfTasks(listsTasksObj);
            }
        }
    }
})