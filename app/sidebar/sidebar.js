(function () {
    angular.module('app.sidebar', [])
        .component('sidebar', {
            bindings: {
                board: '='
            },
            controller: function ($scope, ApiService) {
                this.$onInit = function () {
                    $scope.link = 'http://localhost:3000/b/'+this.board._id;
                    console.log($scope.link)
                    $scope.labels = [
                        { "colour": "#61BD4F" },
                        { "colour": "#F2D600" },
                        { "colour": "#FFAB4A" },
                        { "colour": "#EB5A46" },
                        { "colour": "#FF80CE" },
                        { "colour": "#51E898" },
                        { "colour": "#C377E0" },
                        { "colour": "#0079BF" },
                        { "colour": "#00C2E0" },
                        { "colour": "#4d4d4d" },
                        { "colour": "#B6BBBF" }
                    ];

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
                        return ApiService.board.changeBackground(params).then((resp) => {
                            console.log(resp)
                        });
                    }
                }

                $scope.changeMenu = (name, toggle, level) => {
                    $scope.earlierMenu = $scope.nameMenu;
                    $scope.nameMenu = name;
                    $scope.toggle.rightMenu = toggle;
                    $scope.level = level;
                }



                $scope.labelMenu = (colour, itemName, index, name, toggle, $event) => {
                    $scope.blockClosingList($event);
                    if ($scope.toggle.nestedMenu === true && $scope.indexEditLabel == index) {
                        $scope.toggle.nestedMenu = !$scope.toggle.nestedMenu;
                    }
                    else if ($scope.toggle.nestedMenu === false) {
                        $scope.toggle.nestedMenu = !$scope.toggle.nestedMenu;
                    }

                    $scope.indexEditLabel = index;
                    $scope.name = name;
                    $scope.insertedName = itemName;
                    $scope.selectedColour = colour;
                    $scope.indexEditLabel = index;
                }

                $scope.changeLabelColour = (colour) => {
                    $scope.selectedColour = colour;
                }

                $scope.labelControl = (name, indexLabel) => {

                    var ok = true;
                    if ($scope.selectedColour == null) {
                        $scope.selectedColour = '#B6BBBF';
                    }

                    angular.forEach($scope.board.boardLabels, function (value, key) {
                        if ($scope.board.boardLabels[key].colour == $scope.selectedColour && $scope.board.boardLabels[key].name == name) {
                            ok = false;
                        }
                    });

                    if (indexLabel == null && ok != false) {
                        if (name == '') {
                            $scope.board.boardLabels.push({ 'colour': $scope.selectedColour });
                        }
                        else {
                            $scope.board.boardLabels.push({ 'name': name, 'colour': $scope.selectedColour });
                        }



                    } else {
                        if (name == '') {
                            $scope.board.boardLabels.splice(indexLabel, 1, { 'colour': $scope.selectedColour });
                        }
                        else {
                            $scope.board.boardLabels.splice(indexLabel, 1, { 'name': name, 'colour': $scope.selectedColour });
                        }

                        $scope.insertedName = name;

                    }

                    if (ok != false) {
                        let labelObj = {
                            idBoard: $scope.board._id,
                            labels: $scope.board.boardLabels
                        }


                        return ApiService.staff.addLabelToBoard(labelObj);
                    }

                    $scope.name = '';
                }

                $scope.addLabel = (indexList, indexCard, indexLabel, label) => {
                    var ok = true;
                    var duplicate;

                    angular.forEach($scope.board.lists[indexList].cards[indexCard].labels, function (value, key) {
                        if ($scope.board.lists[indexList].cards[indexCard].labels[key]._id == label._id) {
                            ok = false;
                            duplicate = key;
                        }
                    })

                    if (ok == true) {
                        $scope.board.lists[indexList].cards[indexCard].labels.splice(indexLabel, 0, { '_id': label._id, 'name': label.name, 'colour': label.colour });
                    } else {
                        $scope.board.lists[indexList].cards[indexCard].labels.splice(duplicate, 1);
                    }

                    var labelObj = {
                        idBoard: $scope.board._id,
                        indexList: indexList,
                        indexCard: indexCard,
                        labels: $scope.board.lists[indexList].cards[indexCard].labels
                    }
                    console.log(labelObj)
                    return ApiService.staff.addLabelToCard(labelObj).then(function () {
                    })
                }

                // usuwanie
                $scope.deleteLabel = (_id) => {
                    // return ApiService.staff.deleteLabel(_id);
                    console.log($scope.board.boardLabels)
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



