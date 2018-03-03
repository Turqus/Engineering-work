App.controller('boardsController', function ($scope, $http, ApiService) {

	$scope.init = function (user, board) {
		$scope.toggle = false;
		$scope.loadBoards();
		$scope.user = JSON.parse(user);
	};

	$scope.loadBoards = function () {
		return ApiService.board.boards()
			.then(function (resp) {
				$scope.boards = resp;
				console.log($scope.boards)
			})
	};


	$scope.addBoard = function (newBoard) {
		$scope.boardObj = {
			name: newBoard,
			closed : false
		};

		return ApiService.board.addBoard($scope.boardObj).then(function () {
			$scope.loadBoards();
			$scope.toggle =false;
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


  