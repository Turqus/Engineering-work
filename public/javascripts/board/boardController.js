App.controller('boardController', function ($scope, $http, ApiService, timeAgo, nowTime) {

	$scope.init = function (user, board) {
		$scope.toggle = true;
		$scope.toggleAddCard = false;
		$scope.indexListMenu = '';
		$scope.modelAsJson = '';
		$scope.user = JSON.parse(user);
		$scope.board = JSON.parse(board);
		$scope.name = "dada";


	};

	$scope.loadBoards = () => {
		return ApiService.staff.boards().then((resp) => {
			$scope.boards = resp;
			$scope.selectedBoard = $scope.board._id; 
		});
	}

	// open menu to add card
	$scope.addCard = (index) => {
		if ($scope.toggleAddCard === true && $scope.indexAddCard == index) {
			$scope.toggleAddCard = !$scope.toggleAddCard;
		}
		else if ($scope.toggleAddCard === false) {
			$scope.toggleAddCard = !$scope.toggleAddCard;
		}
		$scope.indexAddCard = index;
	}

	// open menu to add list
	$scope.addListMenuActiv = ($event) => {
		$scope.openMenuAddList = !$scope.openMenuAddList;
	}

	$scope.logEvent = () => {
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
			udpateCard();
		}, false);
	}

	$scope.removeList = function (index) {
		$scope.board.lists.splice(index, 1);

		$scope.$watch('board', function (lists) {
			$scope.modelAsJson = angular.toJson(lists, true);
			udpateCard();
		}, false);
	}

	// $scope.udpateCard = function () {
	function udpateCard() {
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


	$scope.checkDescStatus = (indexList, indexCard, descrip, name) => {
		$scope.commentsLength = $scope.board.lists[indexList].cards[indexCard].comments.length;
		$scope.nameNew = name;
		$scope.descripNew = descrip;
		if ($scope.board.lists[indexList].cards[indexCard].description == undefined)
			$scope.toggleDesc = true;
		else
			$scope.toggleDesc = false;
	}

	$scope.activeMenu = function (name, $event, index) { 

		$scope.blockClosingList($event);
		if (index == undefined) {
			if ($scope.toggle === true && $scope.name === name) {
				$scope.toggle = !$scope.toggle;
			}
			else if ($scope.toggle === false) {
				$scope.toggle = !$scope.toggle;
			}
		} else {
			if ($scope.toggle === true && $scope.name === name && $scope.indexListMenu === index) {
				$scope.toggle = !$scope.toggle;
			}
			else if ($scope.toggle === false) {
				$scope.toggle = !$scope.toggle;
			}
		}

		$scope.name = name;

		if (index != undefined) {
			$scope.indexListMenu = index;

			// download name of list to copy list
			$scope.copyListName = $scope.board.lists[index].list;

			// download boards to changing position of list
			$scope.loadBoards();
		} 
	}

	$scope.blockClosingList = function ($event) {
		$event.stopPropagation();
	}


	//options in list 
	$scope.copyList = (copyListName, indexList) => {
		let copiedList = $scope.board.lists[indexList];
		let newCopyList = {
			list : copiedList.list,
			cards : copiedList.cards
		}
		
		$scope.board.lists.splice(indexList+1, 0, newCopyList);

		let copyListObj = {
			idBoard : $scope.board._id,
			lists : $scope.board.lists
		};

		return ApiService.board.copyList(copyListObj);
	}

	$scope.transferList = (selectedBoard, indexList) => {
		let sendingList = angular.copy($scope.board.lists[indexList]);
		$scope.board.lists.splice(indexList, 1);

		let transferListObj = {
			idBoard: $scope.board._id
		};

		if(selectedBoard === $scope.board._id) {
			$scope.board.lists.unshift(sendingList);
			transferListObj.lists = $scope.board.lists;
			transferListObj.isSame = true;
		} else {
			let filteredBoard = $scope.boards.filter((board) => board._id == selectedBoard);
			filteredBoard[0].lists.unshift(sendingList);
			transferListObj.lists = filteredBoard[0].lists;
			transferListObj.toBoard = selectedBoard;
		}	
		
		return ApiService.board.transferList(transferListObj);
	};

	$scope.archiveList = (indexList) => {
		$scope.board.archives.push($scope.board.lists[indexList]) 
		$scope.board.lists.splice(indexList, 1);

		let archiveListObj = {
			idBoard : $scope.board._id,
			archives : $scope.board.archives,
			lists : $scope.board.lists
		};

		return ApiService.board.archiveList(archiveListObj);
	}



	$scope.archiveCard = (indexList, indexCard) => {
		$scope.board.lists[indexList].cards[indexCard].idList = $scope.board.lists[indexList]._id; 
		$scope.board.cardArchive.unshift($scope.board.lists[indexList].cards[indexCard]); 
		$scope.board.lists[indexList].cards.splice(indexCard, 1);
		
		let modalWindow = document.querySelector(".modal-backdrop");
		modalWindow.classList.remove("modal-backdrop");

		let archiveCardObj = {
			idBoard : $scope.board._id,
			lists : $scope.board.lists,
			cardArchive : $scope.board.cardArchive
		}; 
		return ApiService.card.archiveCard(archiveCardObj);
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




			// $scope.downloadedLists = '';
		// $scope.downloadedLists.lists = [];
		// $scope.commentsLength = ''; 
		// $scope.toggleRightMenu = true;
		// $scope.toggleAddTask = false;
		// $scope.nameMenu = 'Menu';

	// $scope.changeMenu = (name) => {
	// 	$scope.nameMenu = name; 
	// }



	//checkdescstatus
		// $scope.selectedList = '0';
		// $scope.selectedCard = '0';
		// $scope.mainList = JSON.stringify(indexList);
		// $scope.mainCard = JSON.stringify(indexCard);
		// $scope.changeBoard(null);


		// $scope.logevent
				//  document.getElementsByClassName("wewe").style.display = "none";
		// setTimeout(function () { 
		//  document.querySelector("#wewe").style.height = "1000px"
		// }, 15);