
App.directive("listTasks", function () {
	return {
		restrict: "E",
		controller: function ($scope, ApiService) {
			$scope.toggleAddTask = false;
			
			$scope.openAddTask = (index) => {
				if ($scope.toggleAddTask === true && $scope.indexAddTask == index) {
					$scope.toggleAddTask = !$scope.toggleAddTask;
				}
				else if ($scope.toggleAddTask === false) {
					$scope.toggleAddTask = !$scope.toggleAddTask;
				}

				$scope.indexAddTask = index;
				console.log($scope.toggleAddTask, index)
			}

			$scope.addTaskToList = (indexList, indexCard, indexListOfTasks, task) => {
				if ($scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks].tasks == undefined)
					$scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks].tasks = [];

				$scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks].tasks.push({ 'name': task, 'status': false });
				progressBar(indexList, indexCard);

				var listsTasksObj = {
					type: 'task',
					idBoard: $scope.board._id,
					indexList: indexList,
					indexCard: indexCard,
					tasks: $scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks],
					indexListOfTasks: indexListOfTasks
				}
				return ApiService.staff.addListsOfTasks(listsTasksObj);
			}


			$scope.updateStatusInTask = (indexList, indexCard, indexListOfTasks) => {
				progressBar(indexList, indexCard);

				var listsTasksObj = {
					type: 'status',
					status: $scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks],
					indexListOfTasks: indexListOfTasks,
					idBoard: $scope.board._id,
					indexList: indexList,
					indexCard: indexCard
				}
				return ApiService.staff.addListsOfTasks(listsTasksObj);
			}

			$scope.deleteTaskFromList = (indexList, indexCard, indexListOfTasks, indexTask) => {
				$scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks].tasks.splice(indexTask, 1);
				progressBar(indexList, indexCard);
			}

			$scope.deleteListOfTasks = (indexList, indexCard, indexListOfTasks) => {
				$scope.board.lists[indexList].cards[indexCard].listsTasks.splice(indexListOfTasks, 1);
				progressBar(indexList, indexCard);
			}

			function progressBar(indexList, indexCard) {
				$scope.board.lists[indexList].cards[indexCard].listsTasks.forEach(item => {
					var completedTask = item.tasks.filter(t => t.status).length;
					var countTasks = item.tasks.filter(t => t).length;
					item.percent = completedTask * 100 / countTasks;
				})
			}

		 
		},
		templateUrl: '/directives/list-tasks/list-tasks-template.ejs'

	}
})