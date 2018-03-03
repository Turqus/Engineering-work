App.controller('boardController', function ($scope, $http, ApiService, timeAgo, nowTime) {

	$scope.init = function (user, board) {
		$scope.nestedMenuToggle = false;
		$scope.toggle = true;
		$scope.toggleAddCard = false;
		$scope.indexListMenu = '';
		$scope.modelAsJson = '';
		$scope.user = JSON.parse(user);
		$scope.board = JSON.parse(board);
		// $scope.name = "dada";
	};

	$scope.loadBoards = () => {
		return ApiService.board.boards().then((resp) => {
			$scope.boards = resp;
			$scope.selectedBoard = $scope.board._id;
		});
	}
 
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

 
	$scope.dragItem = function (indexList, indexCard) {
		$scope.board.lists[indexList].cards.splice(indexCard, 1);

		$scope.$watch('board', function (lists) {
			$scope.modelAsJson = angular.toJson(lists, true);
			udpateCard();
		}, false);
	}

	$scope.dragList = function (index) {
		$scope.board.lists.splice(index, 1);

		$scope.$watch('board', function (lists) {
			$scope.modelAsJson = angular.toJson(lists, true);
			udpateCard();
		}, false);
	}

	function udpateCard() {
		return ApiService.card.update($scope.modelAsJson).then(function () {
		})
	}
	



	$scope.addList = function (newList) {
		let log = { 'user': $scope.user.username, 'information': 'dodał nową liste ' + newList, 'date': new Date() };
		$scope.board.lists.push({ 'cards': [], 'list': newList });
		$scope.board.activity.unshift(log);

		$scope.ListObj = {
			idBoard: $scope.board._id,
			lists: $scope.board.lists,
			activity: log
		};

		return ApiService.board.addList($scope.ListObj);
	}


	

	$scope.addTask = function (newTask, index) { 
			let log = { 'user': $scope.user.username, 'information': 'dodał nową kartę ' + newTask + ' w liście ' + $scope.board.lists[index].list, 'date': new Date() };
			$scope.board.lists[index].cards.push({ 'name': newTask, 'deadline': null, members: [] });
			$scope.board.activity.unshift(log);
	
			$scope.CardObj = {
				idBoard: $scope.board._id,
				cardIndex: index,
				cards: $scope.board.lists[index].cards,
				activity: log,
				name: newTask
			};
	
			this.newTask = '';
	
			return ApiService.card.add($scope.CardObj).then(function (resp) {
				$scope.toggle = false;
			}) 
	};




	$scope.checkStatus = (indexList, indexCard, descrip, name) => {
		$scope.indexListAttachment = indexList;
		$scope.indexCardAttachment = indexCard;
		$scope.nameNew = name;
		$scope.descripNew = descrip;

		$scope.loadMembers(indexList, indexCard);
		$scope.loadMembersCard(indexList, indexCard);
		if ($scope.board.lists[indexList].cards[indexCard].description == undefined)
			$scope.toggleDesc = true;
		else
			$scope.toggleDesc = false;
	}



	$scope.activeMenu = function (name, $event, index) { 

		console.log($scope.toggle)
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
			$scope.copyListName = $scope.board.lists[index].list;
			$scope.loadBoards();
		}
	}

	$scope.blockClosingList = function ($event) {
		$event.stopPropagation();
	}


	$scope.copyList = (copyListName, indexList) => {
		let copiedList = $scope.board.lists[indexList];

		if (copyListName) copiedList.list = copyListName;

		let newCopyList = {
			list: copiedList.list,
			cards: copiedList.cards
		}

		$scope.board.lists.splice(indexList + 1, 0, newCopyList);

		let copyListObj = {
			idBoard: $scope.board._id,
			lists: $scope.board.lists
		};

		return ApiService.board.copyList(copyListObj)
			.then(() => {
				$scope.toggle = false;
			})
	}


	$scope.transferList = (selectedBoard, indexList) => {
		let sendingList = angular.copy($scope.board.lists[indexList]);
		$scope.board.lists.splice(indexList, 1);
		let transferListObj = {
			idBoard: $scope.board._id
		};

		if (selectedBoard === $scope.board._id) {
			$scope.board.lists.unshift(sendingList);
			transferListObj.lists = $scope.board.lists;
			transferListObj.isSame = true;
		} else {
			let filteredBoard = $scope.boards.filter((board) => board._id == selectedBoard);
			filteredBoard[0].lists.unshift(sendingList);
			transferListObj.lists = filteredBoard[0].lists;
			transferListObj.toBoard = selectedBoard;
			transferListObj.updatedList = $scope.board.lists;
		}

		return ApiService.board.transferList(transferListObj)
			.then(() => {
				$scope.toggle = false;
			})
	};


	$scope.archiveList = (indexList) => {
		$scope.board.archives.push($scope.board.lists[indexList])
		$scope.board.lists.splice(indexList, 1);

		let archiveListObj = {
			idBoard: $scope.board._id,
			archives: $scope.board.archives,
			lists: $scope.board.lists
		};

		return ApiService.board.archiveList(archiveListObj)
			.then((resp) => {
				console.log(resp);
				$scope.toggle = false;
			})
	}
 
	
	$scope.archiveCard = (indexList, indexCard) => {
		$scope.board.lists[indexList].cards[indexCard].idList = $scope.board.lists[indexList]._id;  
		$scope.board.cardArchive.unshift($scope.board.lists[indexList].cards[indexCard]);
		$scope.board.lists[indexList].cards.splice(indexCard, 1);

		let modalWindow = document.querySelector(".modal-backdrop");
		modalWindow.classList.remove("modal-backdrop");

		let archiveCardObj = {
			idBoard: $scope.board._id,
			lists: $scope.board.lists,
			cardArchive: $scope.board.cardArchive
		};
		return ApiService.card.archiveCard(archiveCardObj);
	}



	$scope.addMemberToCard = (indexList, indexCard, finded, index) => {
		let log = { 'user': $scope.user.username, 'information': 'dodał nowego użytkownika do karty ' + $scope.board.lists[indexList].cards[indexCard].name, 'date': new Date() };
		$scope.board.activity.unshift(log);
		$scope.board.lists[indexList].cards[indexCard].members.push(finded);
		$scope.members.splice(index, 1);

		let addMemberToCardObj = {
			idBoard: $scope.board._id,
			members: $scope.board.lists[indexList].cards[indexCard].members,
			indexList: indexList,
			indexCard: indexCard,
			activity: log,
			member: finded
		}

		return ApiService.board.addMemberToCard(addMemberToCardObj).then(() => {
			$scope.loadMembersCard(indexList, indexCard);
		})
	}



	$scope.loadMembers = (indexList, indexCard) => {
		let membersObj = {
			idBoard: $scope.board._id,
			members: $scope.board.lists[indexList].cards[indexCard].members,
			indexList: indexList,
			indexCard: indexCard
		};

		return ApiService.board.loadMembersToAddCard({ membersObj })
			.then(function (resp) {
				$scope.members = resp;
			})
	}



	$scope.loadMembersCard = (indexList, indexCard) => {
		let membersObj = {
			idBoard: $scope.board._id,
			indexList: indexList,
			indexCard: indexCard
		};

		return ApiService.board.loadMembersCard({ membersObj })
			.then(function (resp) {
				$scope.membersCard = resp;
				console.log($scope.membersCard)
			})
	}



	$scope.openMenu = (nameMenu, index) => {
		if ($scope.nestedMenuToggle === true && $scope.detailsUserIndex == index) {
			$scope.nestedMenuToggle = !$scope.nestedMenuToggle;
		} else if ($scope.nestedMenuToggle === false) {
			$scope.nestedMenuToggle = !$scope.nestedMenuToggle;
		}

		$scope.detailsUserIndex = index;
		$scope.nestedNameMenu = nameMenu;
	}

	$scope.deleteMemberWithCard = (index, userID, indexList, indexCard) => {
		$scope.membersCard.splice(index, 1);
		$scope.board.lists[indexList].cards[indexCard].members.splice(index, 1);
 

		let Obj = {
			idBoard: $scope.board._id,
			userID: userID,
			indexList: indexList,
			indexCard: indexCard
		};

		return ApiService.board.deleteMemberWithCard(Obj);
	}



	$scope.deleteImageFromCard = (indexList, indexCard) => {
		let deleteImgObj = {
			idBoard: $scope.board._id,
			indexList: indexList,
			indexCard: indexCard
		};

		return ApiService.card.deleteImageFromCard(deleteImgObj)
			.then(() => {
				$scope.board.lists[indexList].cards[indexCard].image = null;
			})
	}



	$scope.$on('filter-the-cards', function (event, args) {
		$scope.searchCards = args.textSearch;
	});

});


