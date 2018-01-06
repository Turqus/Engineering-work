
App.directive("listTasks", function () {
	return {
		restrict: "E",
		controller: function ($scope, ApiService) {
			$scope.toggleAddTask = false;
			$scope.indexAddTask = '';
			
			$scope.openAddTask = (index) => {
				if ($scope.toggleAddTask === true && $scope.indexAddTask == index) {
					$scope.toggleAddTask = !$scope.toggleAddTask;
				}
				else if ($scope.toggleAddTask === false) {
					$scope.toggleAddTask = !$scope.toggleAddTask;
				}

				$scope.indexAddTask = index; 
			}

			$scope.addTaskToList = (indexList, indexCard, indexListOfTasks, task) => {
				if ($scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks].tasks == undefined)
					$scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks].tasks = [];


				console.log($scope.board.lists[indexList].cards[indexCard].listsTasks)

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

				let taskObj = {
					idBoard : $scope.board._id,
					tasks : $scope.board.lists[indexList].cards[indexCard].listsTasks[indexListOfTasks].tasks,
					indexList : indexList,
					indexCard : indexCard,
					indexListOfTasks : indexListOfTasks
				}
				
				return ApiService.card.deleteTaskFromList(taskObj);
			}

			$scope.deleteListOfTasks = (indexList, indexCard, indexListOfTasks) => {
				$scope.board.lists[indexList].cards[indexCard].listsTasks.splice(indexListOfTasks, 1);
				progressBar(indexList, indexCard);
 
				let listTaskObj = {
					idBoard : $scope.board._id,
					listsTasks : $scope.board.lists[indexList].cards[indexCard].listsTasks,
					indexList : indexList,
					indexCard : indexCard
				}
				
				return ApiService.card.deleteListOfTasks(listTaskObj);
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