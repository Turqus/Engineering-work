App.controller('boardController', function ($scope, $http, ApiService, timeAgo, nowTime) {

	$scope.init = function (user, board) {
		// $scope.downloadedLists = '';
		// $scope.downloadedLists.lists = [];
		// $scope.commentsLength = ''; 

		$scope.toggleAddTask = false;
		$scope.toggle = false;
		$scope.toggleRightMenu = true;
		$scope.toggleAddCard = false;
		$scope.nameMenu = 'Menu';

		$scope.modelAsJson = '';
		$scope.user = JSON.parse(user);
		$scope.board = JSON.parse(board);
	};

	// $scope.changeMenu = (name) => {
	// 	$scope.nameMenu = name; 
	// }

	$scope.addCard = (index) => {
		if ($scope.toggleAddCard === true && $scope.indexAddCard == index) {
			$scope.toggleAddCard = !$scope.toggleAddCard;
		}
		else if ($scope.toggleAddCard === false) {
			$scope.toggleAddCard = !$scope.toggleAddCard;
		}

		$scope.indexAddCard = index;
	}

	$scope.addListMenuActiv = ($event) => {
		$scope.openMenuAddList = !openMenuAddList;
	}


	$scope.logEvent = () => {
		//  document.getElementsByClassName("wewe").style.display = "none";
		// setTimeout(function () { 
		//  document.querySelector("#wewe").style.height = "1000px"
		// }, 15);
		setTimeout(function () {
			document.querySelector("ul[dnd-list] > .dndDraggingSource").style.display = "none"
		}, 20);
	}

	$scope.endEvent = () => {
		document.querySelector("ul[dnd-list] > .dndDraggingSource").style.display = "block"
	}

	// $scope.removeTask = function (task) {
	// 	var index = $scope.tasks.indexOf(task);
	// 	$scope.tasks.splice(index, 1);
	// };

	// PRZENOSZENIE ITEMOW I ZAPISYWANIE DO LISTY 
	$scope.removeItem = function (indexList, indexCard) {
		$scope.board.lists[indexList].cards.splice(indexCard, 1);

		$scope.$watch('board', function (lists) {
			$scope.modelAsJson = angular.toJson(lists, true);
			$scope.udpateCard();
		}, false);
	}

	$scope.removeList = function (index) {
		$scope.board.lists.splice(index, 1);

		$scope.$watch('board', function (lists) {
			$scope.modelAsJson = angular.toJson(lists, true);
			$scope.udpateCard();
		}, false);
	}

	$scope.udpateCard = function () {
		return ApiService.staff.update($scope.modelAsJson).then(function () {
		})
	}
	//---------------------------------------------
	// DODAWANIE LIST
	$scope.addList = function (newList) {
		$scope.board.lists.push({ 'cards': [], 'list': newList });

		$scope.ListObj = {
			idBlackBoard: $scope.board._id,
			lists: $scope.board.lists
		};

		return ApiService.staff.addList($scope.ListObj).then(function () {
			// $scope.loadLists();
		})
	}

	// DODAWANIE KART 
	$scope.addTask = function (newTask, index) {
		$scope.board.lists[index].cards.push({ 'name': newTask, 'subscription': false, 'deadline': null });

		$scope.CardObj = {
			idBlackBoard: $scope.board._id,
			cardIndex: index, 
			cards: $scope.board.lists[index].cards
		}; 

		this.newTask = '';

		return ApiService.staff.add($scope.CardObj).then(function () {
			//$scope.loadLists();
		})
	};
 
	//********************* */
	// improve communication
	//********************** */
	$scope.checkDescStatus = (indexList, indexCard, descrip, name) => {
		$scope.commentsLength = $scope.board.lists[indexList].cards[indexCard].comments.length;
		$scope.loadBoards();
		// $scope.selectedList = '0';
		// $scope.selectedCard = '0';
		// $scope.mainList = JSON.stringify(indexList);
		// $scope.mainCard = JSON.stringify(indexCard);
		// $scope.changeBoard(null);
		$scope.nameNew = name;
		$scope.descripNew = descrip;
		if ($scope.board.lists[indexList].cards[indexCard].description == undefined)
			$scope.toggleDesc = true;
		else
			$scope.toggleDesc = false;
	}

	$scope.activeMenu = function (name, toggle, $event) {
		$scope.blockClosingList($event);
		if ($scope.toggle === true && $scope.name == name) {
			$scope.toggle = toggle;
		}
		else if ($scope.toggle === false) {
			$scope.toggle = toggle;
		}
		$scope.name = name;
	}

	$scope.blockClosingList = function ($event) {
		$event.stopPropagation();
	}

});




App.directive("fileread", [function () {
	return {
		scope: {
			fileread: "="
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.fileread = loadEvent.target.result;
					});
				}
				reader.readAsDataURL(changeEvent.target.files[0]);
				console.log(reader);
				scope.sendFile(reader);

			});
		},
		controller: function ($scope, $http) {
			$scope.sendFile = (reader) => {
				$http({
					method: 'POST',
					url: '/card/upload-attachment',
					headers: { 'Content-Type': 'multipart/form-data' },
					data: { reader }
				}).then(function successCallback(response) {
					console.log(response)
				}, function errorCallback(response) {
					console.log(response);
				});
			}
		}
	}
}]);


	// $scope.addMemberBoard = (_id) => {
	// 	$scope.board.users.push(_id);
	// 	return ApiService.staff.addMemberBoard($scope.board).then(function () {
	// 	})
	// }

	// $scope.addMemberToCard = (indexList, indexCard, member) => {
	// 	$scope.board.lists[indexList].cards[indexCard].Author.push(member);
	// 	return ApiService.staff.addMemberToCard($scope.board).then(function () {
	// 	})
	// }
