App.directive("comment", function() {
    return {
        restrict: "E", 
		templateUrl: '/directives/comment/comment-template.ejs',
        controller: function($scope, ApiService) {  
            $scope.toggler = {
                editComment : false
            };

            $scope.editCommentBtn = (indexComment, oldTxt) => {
                $scope.toggler.editComment = !$scope.toggler.editComment;
                $scope.indexComment = indexComment;
                $scope.editTxt = oldTxt; 
                console.log(indexComment, oldTxt, $scope.toggler.editComment)
            };

            $scope.editComment = (indexList, indexCard, indexComment, contents) => {
                $scope.board.lists[indexList].cards[indexCard].comments[indexComment].text = contents;

                let editCommentObj = {
                    idBoard : $scope.board._id,
                    text : contents,
                    indexList : indexList,
                    indexCard : indexCard,
                    indexComment : indexComment
                };

                return ApiService.staff.editComment(editCommentObj)
                .then(()=> {
                    $scope.toggler.editComment = !$scope.toggler.editComment;
                })



            }

            $scope.addComment = (indexList, indexCard, commentCard) => {  
                if ($scope.board.lists[indexList].cards[indexCard].comments == undefined) {
                    $scope.board.lists[indexList].cards[indexCard].comments = [];
                };
            
                let commentCardObj = {
                    text: commentCard,
                    authorID: $scope.user._id,
                    name: $scope.user.username
                };
            
                $scope.board.lists[indexList].cards[indexCard].comments.unshift(commentCardObj);
            
                commentCardObj = {
                    idBoard: $scope.board._id,
                    indexList: indexList,
                    indexCard: indexCard,
                    lists: $scope.board.lists
                };
            
                return ApiService.staff.addComment(commentCardObj).then(function (resp) {
                    console.log(resp)
                });
            };

            $scope.deleteComment = (indexList, indexCard, indexComment) => {
                $scope.board.lists[indexList].cards[indexCard].comments.splice(indexComment, 1);

                let deleteCommentObj = {
                    idBoard : $scope.board._id,
                    comments : $scope.board.lists[indexList].cards[indexCard].comments,
                    indexList : indexList,
                    indexCard : indexCard, 
                };

                return ApiService.staff.deleteComment(deleteCommentObj);
            }

        }
    }
})