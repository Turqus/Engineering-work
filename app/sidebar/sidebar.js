(function () {
    angular.module('app.sidebar', [])
        .component('sidebar', {
            bindings: {
                board: '='
            },
            controller: function ($scope, ApiService) {
                this.$onInit = function () {
                    $scope.board = this.board;
                    $scope.link = 'http://localhost:3000/b/' + this.board._id;

                    $scope.toggle = {
                        rightMenu: false,
                        nestedMenu: false,
                    }
                    $scope.nestedNameMenu = '';
                    $scope.nameMenu = 'Menu';
                };

                $scope.openNestedMenu = (nestedNameMenu) => {
                    $scope.nestedNameMenu = nestedNameMenu;
                    $scope.toggle.nestedMenu = !$scope.toggle.nestedMenu;
                }

                $scope.changeBackground = (background) => {
                    if (this.board.background != background) {
                        this.board.background = background;
                        var params = {
                            _id: this.board._id,
                            background: background
                        };
                        return ApiService.board.changeBackground(params);
                    }
                }

                $scope.changeMenu = (name, toggle, level) => {
                    $scope.earlierMenu = $scope.nameMenu;
                    $scope.nameMenu = name;
                    $scope.toggle.rightMenu = toggle;
                    $scope.level = level;
                }

                $scope.toggleBoard = () => {
                    let toggleBoardObj = {
                        idBoard: $scope.board._id,
                        closed: !$scope.board.closed
                    };

                    $scope.board.closed = !$scope.board.closed;
                    $scope.nestedNameMenu = '';
                    $scope.toggle.nestedMenu = false;

                    return ApiService.board.toggleBoard(toggleBoardObj);
                }

                $scope.copyBoard = (copy) => {
                    let copyBoardObj = angular.copy($scope.board);
                    delete copyBoardObj._id;
                    copyBoardObj.name = copy.name;
                    if (!copy.status) copyBoardObj.lists.forEach((element) => element.cards = []);
                    return ApiService.board.copyBoard(copyBoardObj);
                }


                // //etykiety

// SEND BACK

                $scope.sendBackToBoard = (indexCard) => {
                    var exist = false;
                    var position;

                    var cardObj = {
                        idBoard : $scope.board._id,
                    };

                    if ($scope.board.lists.length > 0) {
                        $scope.board.lists.forEach((element, key) => {
                            if (element._id === $scope.board.cardArchive[indexCard].idList) {
                                exist = true;
                                position = key;
                            } else {
                                exist = false;
                            }

                            if (exist === true) {
                                $scope.board.lists[position].cards.unshift($scope.board.cardArchive[indexCard]);
                                $scope.board.cardArchive.splice(indexCard, 1);

                                cardObj.lists = $scope.board.lists[position];
                                cardObj.cardArchive = $scope.board.cardArchive;

                                return ApiService.card.sendBackToBoardCard(cardObj);
                            }
                        })
                    };


                    if (exist === false) $scope.board.archives.forEach((element, key) => {
                        if (element._id === $scope.board.cardArchive[indexCard].idList) {
                            position = key;
                            exist = true
                        } else {
                            exist = false;
                        }

                        if (exist === true) {
                            $scope.board.archives[position].cards.unshift($scope.board.cardArchive[indexCard]); 
                            $scope.board.cardArchive.splice(indexCard, 1);

                            cardObj.archives = $scope.board.archives;
                            cardObj.cardArchive = $scope.board.cardArchive;

                            return ApiService.card.sendBackToBoardCard(cardObj);
                        }
                    });
                };


                $scope.sendListBackToBoard = (indexList) => {
                    $scope.board.lists.unshift($scope.board.archives[indexList]);
                    $scope.board.archives.splice(indexList, 1);

                    let listObj = {
                        idBoard : $scope.board._id,
                        lists :  $scope.board.lists,
                        archives : $scope.board.archives
                    };

                    return ApiService.card.sendListBackToBoard(listObj);
                }

                $scope.deleteCardFromArchive = (indexCard) => {
                    $scope.board.cardArchive.splice(indexCard, 1);

                    let deleteObj = {
                        idBoard : $scope.board._id,
                        cardArchive : $scope.board.cardArchive
                    }

                    return ApiService.card.deleteCardFromArchive(deleteObj);
                }



                $scope.blockClosingList = function ($event) {
                    $event.stopPropagation();
                }

            },
            controllerAs: 'sidebar',
            templateUrl: '/sidebar/sidebar-template.html'
        })
})();

