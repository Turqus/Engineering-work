App.controller('boardsController', function ($scope, $http, ApiService) {

	$scope.init = function (user, board) {
		$scope.toggle = false;
		$scope.loadBoards();
		$scope.user = JSON.parse(user);
	};

	$scope.loadBoards = function () {
		return ApiService.staff.boards()
			.then(function (resp) {
				$scope.boards = resp;
			})
	};


	$scope.addBoard = function (newBoard) {
		$scope.boardObj = {
			name: newBoard,
			closed : false
		};

		return ApiService.staff.addBoard($scope.boardObj).then(function () {
			$scope.loadBoards();
		})
	};



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

















// App.service('loadBoard', function (ApiService) {
// 	// this.whichBoard = (index) => {
// 	// 	this.whichBoard = index;
// 	// }
// 	this.index = 1;

// 	this.listBoards = [];
// 	this.listLists = [];

// 	this.Board = ApiService.staff.boards().then((resp) => {
// 		this.result = resp;

// 		// angular.forEach(this.result, (value, key) => {
// 		// 	console.log(value)
// 		// 	this.listBoards[key] = { 'name': value.name, '_id': value._id };
// 		// })
// 		// console.log(this.listBoards)
// 		//-----------------------------------------------------------------


// 		angular.forEach(this.result, (value, key) => {
// 			this.listLists[key] = value;
// 		})

// 		console.log(this.listLists)


		// 'cardsLength': value.lists.cards.length






		// lalala    		console.log(this.result[key].lists) 
		// console.log(this.listBoards) 



// 		// this.result.forEach(function(element) {
// 		// 	console.log(element)
// 		// }); 
// 	});

// 	// console.log('listBoards', this.listBoards)
// 	// console.log('listLists', this.listLists)

// });





