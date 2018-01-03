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
                        // rightMenu: false,
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

                $scope.blockClosingList = function ($event) {
                    $event.stopPropagation();
                }

            },
            controllerAs: 'sidebar',
            templateUrl: '/sidebar/sidebar-template.html'
        })
})();

