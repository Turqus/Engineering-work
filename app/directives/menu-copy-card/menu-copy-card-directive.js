App.directive("menuCopyCard", function () {
    return {
        restrict: "E",
        templateUrl: '/directives/menu-copy-card/menu-copy-card-template.ejs',
        controller: function ($scope, ApiService) {

            $scope.downloadedLists = [{ 'list': 'n/a' }];

            $scope.copyCard = (nameNew, statusComment, selectedBoard, selectedList, indexList, indexCard) => {
                console.log(nameNew, status, selectedBoard, selectedList, indexList, indexCard)

                if (!nameNew || !selectedBoard || !selectedList) {

                } else {
                    let
                        card = $scope.board.lists[indexList].cards[indexCard],
                        copiedCardObj = {
                            idBoard: $scope.board._id,
                            selectedBoard: selectedBoard,
                            selectedList: selectedList,
                            indexList: indexList 
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

                        copiedCardObj.lists = $scope.board.lists;

                        return ApiService.card.copyCard(copiedCardObj);
                    } else {

                    }
                }

            }
        }
    }
});

