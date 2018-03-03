App.directive("menuCopyCard", function () {
    return {
        restrict: "E",
        templateUrl: '/directives/menu-copy-card/menu-copy-card-template.ejs',
        controller: function ($scope, ApiService) {
            $scope.downloadedLists = [{ 'list': 'n/a' }];
            $scope.copyCard = (nameNew, statusComment, selectedBoard, selectedList, indexList, indexCard) => {
                var filteredBoard;
                if (!nameNew || !selectedBoard || !selectedList) {
                    $scope.info = "Nie można skopiować karty"
                } else {
                    let
                        card = $scope.board.lists[indexList].cards[indexCard],
                        copiedCardObj = {
                            selectedList: selectedList,
                        },
                        copiedCard = {
                            name: nameNew,
                            deadline: card.deadline,
                            subscription: card.subscription,
                            listsTasks: card.listsTasks,
                            attachments: card.attachments,
                            comments: card.comments,
                            Author: card.Author,
                            labels: card.labels
                        };

                    if (!statusComment) copiedCard.comments = [];
                    if (selectedBoard === $scope.board._id) {
                        $scope.board.lists[selectedList].cards.unshift(copiedCard);
                        copiedCardObj.idBoard = $scope.board._id;
                        copiedCardObj.lists = $scope.board.lists;
                        return ApiService.card.copyCard(copiedCardObj);
                    } else {
                        filteredBoard = $scope.boards.filter((board) => board._id == selectedBoard);
                        if (filteredBoard.length > 0) {
                            filteredBoard[0].lists[selectedList].cards.unshift(copiedCard);
                            copiedCardObj.cards = filteredBoard[0].lists[selectedList].cards;
                            copiedCardObj.selectedBoard = selectedBoard;
                            return ApiService.card.copyCard(copiedCardObj);
                        }
                    }
                }

            }
        }
    }
});

