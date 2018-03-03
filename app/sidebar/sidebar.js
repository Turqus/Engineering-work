(function () {
    angular.module('app.sidebar', [])
        .component('sidebar', {
            bindings: {
                board: '=',
                user: '='
            },
            controller: function ($scope, ApiService, $rootScope) {
                this.$onInit = function () {
                    $scope.nestedMenuToggle = false;
                    $scope.board = this.board;
                    $scope.user = this.user;
                    $scope.link = 'http://localhost:3000/b/' + this.board._id;

                    $scope.toggle = {
                        nestedMenu: false,
                        // openMenuToAddUsersToBoard: false
                    }

                    // $scope.nestedNameMenu = '';
                    $scope.nameMenu = 'Menu';
                    $scope.loadMembers();
                };


                $scope.deleteMemberWithBoard = (index, idMember) => {
                    $scope.members.splice(index, 1);
                    let notification = { 'user': $scope.user.username, 'information': 'usunął Cię z tablicy ' + $scope.board.name, 'date': new Date() };

                    let deleteMemberObj = {
                        idBoard: $scope.board._id,
                        idMember: idMember,
                        notification: notification,
                        newMember: idMember
                    };

                    return ApiService.board.deleteMemberWithBoard(deleteMemberObj)
                        .then(() => {
                            $scope.nestedMenuToggle = false;
                        })

                };


                $scope.openMenu = (nameMenu, index) => {

                    if ($scope.nestedMenuToggle === true && $scope.detailsUserIndex == index) {
                        $scope.nestedMenuToggle = !$scope.nestedMenuToggle;
                    }
                    else if ($scope.nestedMenuToggle === false) {
                        $scope.nestedMenuToggle = !$scope.nestedMenuToggle;
                    }

                    $scope.detailsUserIndex = index;
                    $scope.nestedNameMenu = nameMenu;
                }


                $scope.openMenuToAddPeople = (nameMenu) => {
                    $scope.nestedNameMenu = nameMenu;
                    $scope.nestedMenuToggle = !$scope.nestedMenuToggle;
                }

                $scope.openSidebar = () => {
                    $scope.toggle.rightMenu = !$scope.toggle.rightMenu;
                }

                $scope.findMember = (keyWord) => {
                    var memberObj = {
                        keyWord: keyWord,
                        users: $scope.board.users
                    };

                    return ApiService.board.findMember(memberObj).then((resp) => {
                        $scope.findedUsers = resp;
                    })
                }

                $scope.addMemberToBard = (newMember, whichMember) => {
                    let log = { 'user': $scope.user.username, 'information': 'dodał nowego użytkownika do tablicy', 'date': new Date() };
                    let notification = { 'user': $scope.user.username, 'information': 'dodał Ciebie do tablicy ' + $scope.board.name, 'date': new Date() };
                    $scope.board.activity.unshift(log);

                    $scope.findedUsers.splice(whichMember, 1);

                    $scope.board.users.push(
                        newMember._id
                    );


                    let newMemberObj = {
                        idBoard: $scope.board._id,
                        users: $scope.board.users,
                        activity: log,
                        notification: notification,
                        newMember: newMember._id
                    };

                    return ApiService.board.addMemberBoard(newMemberObj)
                        .then(() => {
                            $scope.loadMembers()
                                .then(() => {
                                    $scope.nestedMenuToggle = false;
                                })
                        })

                };



                $scope.loadMembers = () => {
                    var members = $scope.board.users;

                    return ApiService.board.loadMembers({ members })
                        .then(function (resp) {
                            $scope.members = resp;
                        })
                }

                $scope.openNestedMenu = (nestedNameMenu) => {
                    $scope.nestedNameMenu = nestedNameMenu;
                    $scope.toggle.nestedMenu = !$scope.toggle.nestedMenu;
                };

                $scope.changeBackground = (background) => {
                    if (this.board.background != background) {
                        this.board.background = background;
                        this.board.image = null;

                        let log = { 'user': $scope.user.username, 'information': 'zmienił tło dla tej tablicy', 'date': new Date() };
                        $scope.board.activity.unshift(log);

                        var params = {
                            idBoard: this.board._id,
                            background: background,
                            activity: log
                        };
                        return ApiService.board.changeBackground(params);
                    }
                };


                $scope.changeBackgroundToPhoto = (namePhoto) => {
                    if (this.board.background != null) this.board.background = null;

                    let log = { 'user': $scope.user.username, 'information': 'zmienił tło dla tej tablicy', 'date': new Date() };
                    $scope.board.activity.unshift(log);


                    let imageObj = {};
                    imageObj.idBoard = $scope.board._id;
                    imageObj.namePhoto = namePhoto;
                    imageObj.activity = log;

                    return ApiService.board.changeBackgroundToPhoto(imageObj)
                        .then(() => {
                            if ($scope.board.image != namePhoto) $scope.board.image = namePhoto;
                        });
                };


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
                    return ApiService.board.copyBoard(copyBoardObj)
                        .then(() => {
                            $scope.toggle.nestedMenu = false;
                        })
                }



                $scope.sendBackToBoard = (indexCard) => {
                    var exist = false,
                        position,
                        cardObj = {
                            idBoard: $scope.board._id,
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
                                cardObj.lists = $scope.board.lists;
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
                        idBoard: $scope.board._id,
                        lists: $scope.board.lists,
                        archives: $scope.board.archives
                    };

                    return ApiService.card.sendListBackToBoard(listObj);
                }

                $scope.deleteCardFromArchive = (indexCard) => {
                    $scope.board.cardArchive.splice(indexCard, 1);

                    let deleteObj = {
                        idBoard: $scope.board._id,
                        cardArchive: $scope.board.cardArchive
                    }

                    return ApiService.card.deleteCard(deleteObj);
                }


                $scope.permissionToComment = (Boolean) => {
                    let permissionObj = {
                        idBoard: $scope.board._id,
                        query: {
                            $set: {
                                "permissions.addingComments": !$scope.board.permissions.addingComments
                            }
                        }
                    };

                    return ApiService.permissions.permissionToComment(permissionObj)
                        .then(() => {
                            $scope.board.permissions.addingComments = !$scope.board.permissions.addingComments;
                            $scope.toggle.nestedMenu = false;
                        })
                };


                $scope.permissionsToAddLists = (Boolean) => {
                    let permissionObj = {
                        idBoard: $scope.board._id,
                        query: {
                            $set: {
                                "permissions.addingLists": !$scope.board.permissions.addingLists
                            }
                        }
                    };

                    return ApiService.permissions.permissionsToAddLists(permissionObj)
                        .then(() => {
                            $scope.board.permissions.addingLists = !$scope.board.permissions.addingLists;
                            $scope.toggle.nestedMenu = false;
                        })
                };


                $scope.permissionsToAddCards = (Boolean) => {
                    let permissionObj = {
                        idBoard: $scope.board._id,
                        query: {
                            $set: {
                                "permissions.addingCards": !$scope.board.permissions.addingCards
                            }
                        }
                    };

                    return ApiService.permissions.permissionsToAddCards(permissionObj)
                        .then(() => {
                            $scope.board.permissions.addingCards = !$scope.board.permissions.addingCards;
                            $scope.toggle.nestedMenu = false;
                        })
                };


                $scope.permissionsToAddingPeopleToTheBoard = (Boolean) => {
                    let permissionObj = {
                        idBoard: $scope.board._id,
                        query: {
                            $set: {
                                "permissions.addingPeopleToTheBoard": !$scope.board.permissions.addingPeopleToTheBoard
                            }
                        }
                    };

                    return ApiService.permissions.permissionsToAddingPeopleToTheBoard(permissionObj)
                        .then(() => {
                            $scope.board.permissions.addingPeopleToTheBoard = !$scope.board.permissions.addingPeopleToTheBoard;
                            $scope.toggle.nestedMenu = false;
                        })
                };


                $scope.permissionsToAddingPeopleToTheCards = (Boolean) => {
                    let permissionObj = {
                        idBoard: $scope.board._id,
                        query: {
                            $set: {
                                "permissions.addingPeopleToTheCards": !$scope.board.permissions.addingPeopleToTheCards
                            }
                        }
                    };

                    return ApiService.permissions.permissionsToAddingPeopleToTheCards(permissionObj)
                        .then(() => {
                            $scope.board.permissions.addingPeopleToTheCards = !$scope.board.permissions.addingPeopleToTheCards;
                            $scope.toggle.nestedMenu = false;
                        })
                };

                $scope.permissionsToTheVisibilityOfTheBoard = (Boolean) => {
                    let permissionObj = {
                        idBoard: $scope.board._id,
                        query: {
                            $set: {
                                "permissions.theVisibilityOfTheBoard": !$scope.board.permissions.theVisibilityOfTheBoard
                            }
                        }
                    };

                    return ApiService.permissions.permissionsToTheVisibilityOfTheBoard(permissionObj)
                        .then(() => {
                            $scope.board.permissions.theVisibilityOfTheBoard = !$scope.board.permissions.theVisibilityOfTheBoard;
                            $scope.toggle.nestedMenu = false;
                        })
                };

                $scope.filterTheCardsFunction = (filterTheCards) => {
                    $rootScope.$broadcast('filter-the-cards', { "textSearch": filterTheCards });
                }



                $scope.blockClosingList = function ($event) {
                    $event.stopPropagation();
                }

            },
            controllerAs: 'sidebar',
            templateUrl: '/sidebar/sidebar-template.html'
        })
})();

