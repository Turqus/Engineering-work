App.directive("menuTransferCard", () => {
    return {
        restrict: "E",
        templateUrl: '/directives/menu-transfer-card/menu-transfer-card-template.ejs',
        controller: ($scope, ApiService) => {
            $scope.initBoards = () => {
                $scope.loadBoards();
            }

            $scope.loadBoards = () => {
                return ApiService.staff.boards().then((resp) => {
                    $scope.boards = resp;
                    $scope.selectedBoard = $scope.board._id;
                    $scope.changeBoard($scope.board._id);
                });
            }

            $scope.changeBoard = (_id) => {
                let boardId = _id || $scope.board._id;
                $scope.downloadedLists = [{ 'list': 'n/a' }];

                let params = {
                    _id: _id
                }

                return ApiService.staff.selectedBoard(params).then((resp) => {
                    if (resp.lists.length != 0) {
                        $scope.downloadedLists = resp.lists;
                        $scope.selectedList = "0";
                    }
                })
            };

            $scope.transferCard = (toBoard, toList, indexList, indexCard) => {
                if ($scope.downloadedLists[0].list === "n/a") {

                } else {
                    var filteredBoard;

                    let transferCardObj = {
                        idBoard: $scope.board._id,
                        toList: toList,
                        fromIndexList: indexList
                    };

                    if (toBoard === $scope.board._id) {
                        $scope.board.lists[toList].cards.unshift($scope.board.lists[indexList].cards[indexCard]);
                        $scope.board.lists[indexList].cards.splice(indexCard, 1);
                        transferCardObj.lists = $scope.board.lists;
                        transferCardObj.toCards = $scope.board.lists[toList].cards;
                    } else {
                        filteredBoard = $scope.boards.filter((board) => board._id == toBoard);
                        if (filteredBoard.length > 0) {
                            filteredBoard[0].lists[toList].cards.unshift($scope.board.lists[indexList].cards[indexCard]);
                            $scope.board.lists[indexList].cards.splice(indexCard, 1);
                            transferCardObj.toCards = filteredBoard[0].lists[toList].cards;
                            transferCardObj.toBoard = toBoard;
                        }
                    }

                    transferCardObj.fromCards = $scope.board.lists[indexList].cards;


                    let modalWindow = document.querySelector(".modal-backdrop");
                    modalWindow.classList.remove("modal-backdrop");

                    return ApiService.card.transferCard(transferCardObj);
                }
            };
        }
    }
});