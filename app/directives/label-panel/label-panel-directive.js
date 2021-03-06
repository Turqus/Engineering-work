App.directive("labelPanel", function (ApiService) {
	return {
		restrict: 'E',
		templateUrl: '/directives/label-panel/label-panel-template.ejs',
		controller: function ($scope) {
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
				{ "colour": "#B6BBBF" }	];

			$scope.toggles = { 
				nestedMenu: false,	}


			
			$scope.deleteLabel = (indexLabel) => { 
					$scope.board.boardLabels.splice(indexLabel, 1);
					var obj = { 
						idBoard : $scope.board._id,
						boardLabels : $scope.board.boardLabels
					}; 

					return ApiService.board.deleteLabel(obj)
					.then((resp)=> {
						$scope.toggles.nestedMenu = false;
					})
				}
 

			$scope.createLabel = (insertedName) => {
				let isValidated = validateLabel(insertedName)
				if (isValidated === true) {
					if (insertedName == '') $scope.board.boardLabels.push({ 'colour': $scope.selectedColour });
					else $scope.board.boardLabels.push({ 'name': insertedName, 'colour': $scope.selectedColour });
					updateListLabels()
				} else {
					$scope.toggles.nestedMenu = false;
				}
			};

			function validateLabel(name) {
				var ok = true;
				if ($scope.selectedColour == null) $scope.selectedColour = '#B6BBBF';
	
				angular.forEach($scope.board.boardLabels, function (value, key) {
					if ($scope.board.boardLabels[key].colour == $scope.selectedColour && $scope.board.boardLabels[key].name == name) ok = false;
				});

				return ok;
			};

			$scope.editLabel = (insertedName, indexLabel) => {
				let isValidated = validateLabel(insertedName)
				if (isValidated === true) {
					if (insertedName == '') {
						$scope.board.boardLabels.splice(indexLabel, 1, { 'colour': $scope.selectedColour });
					}
					else {
						$scope.board.boardLabels.splice(indexLabel, 1, { 'name': insertedName, 'colour': $scope.selectedColour });
					}
					updateListLabels();
				} else {

				}
				$scope.insertedName = insertedName;
			};

			function updateListLabels() {
				let labelObj = {
					idBoard: $scope.board._id,
					labels: $scope.board.boardLabels
				}

				return ApiService.board.addLabelToBoard(labelObj)
					.then(() => {
						$scope.toggles.nestedMenu = false;
					})
			};
			$scope.changeLabelColour = (colour) => {
				$scope.selectedColour = colour;
			};
			$scope.labelMenu = ($event, nameMenu, index, item) => {
				$scope.blockClosingList($event);
				if ($scope.toggles.nestedMenu === true && $scope.indexEditLabel == index) {
					$scope.toggles.nestedMenu = !$scope.toggles.nestedMenu;
				}
				else if ($scope.toggles.nestedMenu === false) {
					$scope.toggles.nestedMenu = !$scope.toggles.nestedMenu;
				}

				if (index != undefined && item != undefined) {
					$scope.insertedName = item.name;
					$scope.selectedColour = item.colour;
					$scope.indexEditLabel = index;
				} else {
					$scope.insertedName = '';
					$scope.selectedColour = '#B6BBBF';
				}

				$scope.names = nameMenu;
			};
			$scope.addLabel = (indexList, indexCard, indexLabel, label) => {
				if (indexList != undefined) {
					var ok = true;
					var duplicate;

					angular.forEach($scope.board.lists[indexList].cards[indexCard].labels, function (value, key) {
						if ($scope.board.lists[indexList].cards[indexCard].labels[key]._id == label._id) {
							ok = false;
							duplicate = key;
						}
					})

					if (ok == true) $scope.board.lists[indexList].cards[indexCard].labels.splice(indexLabel, 0, { '_id': label._id, 'name': label.name, 'colour': label.colour });
					else $scope.board.lists[indexList].cards[indexCard].labels.splice(duplicate, 1);
					
					var labelObj = {
						idBoard: $scope.board._id,
						indexList: indexList,
						indexCard: indexCard,
						labels: $scope.board.lists[indexList].cards[indexCard].labels
					}
					return ApiService.card.addLabelToCard(labelObj).then(function () {
						$scope.toggles.nestedMenu = false;
					})
				}
			}
		}
	}
})