App.directive("menuTransferCard", () => {
    return {
        restrict: "E",
		templateUrl: '/directives/menu-transfer-card/menu-transfer-card-template.ejs',
        controller: ($scope, ApiService)=> {

            
            $scope.loadBoards = () => {
                return ApiService.staff.boards().then((resp) => {
                    $scope.boards = resp;
                    $scope.selectedBoard = $scope.board._id;
                    $scope.changeBoard($scope.board._id);
                });
            }

            $scope.changeBoard = (_id) => {
                var boardId = _id || $scope.board._id;
        
                $scope.downloadedLists = [{ 'list': 'n/a' }];
        
                var params = {
                    _id: _id
                }
        
                return ApiService.staff.selectedBoard(params).then((resp) => {
                    if (resp.lists.length != 0) {
                        $scope.downloadedLists = resp.lists;
                    }
                }).then(() => {
                    $scope.selectedList = "0";
                })
            };
        
        
        
            $scope.changePositionCard = (toBoard, toList) => {
                console.log(toBoard, toList);
            };
        }
    }
});