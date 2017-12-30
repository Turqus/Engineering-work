App.directive("comment", function() {
    return {
        restrict: "E",
		templateUrl: '/directives/comment/comment-template.ejs',
        controller: function($scope, ApiService) {

            $scope.addComment = (indexList, indexCard, commentCard) => {
                if ($scope.board.lists[indexList].cards[indexCard].comments == undefined) {
                    $scope.board.lists[indexList].cards[indexCard].comments = [];
                }
            
                let commentCardObj = {
                    text: commentCard,
                    authorID: $scope.user._id,
                    name: $scope.user.username
                }
            
                $scope.board.lists[indexList].cards[indexCard].comments.unshift(commentCardObj);
            
                commentCardObj = {
                    idBoard: $scope.board._id,
                    indexList: indexList,
                    indexCard: indexCard,
                    lists: $scope.board.lists
                }
            
                return ApiService.staff.addComment(commentCardObj).then(function (resp) {
                    console.log(resp)
                })
            }

        }
    }
})