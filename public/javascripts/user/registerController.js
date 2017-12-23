App.controller('TodoListCtrl', function ($scope, $http, ApiService) {
	
	$scope.init = function (user, board) {  
		// $scope.user = JSON.parse(user);
		// $scope.board = JSON.parse(board);
//   modalOpened = false;
	};

   
  
//   $scope.openingModal = function(e) {
//     // opening the modal, stop propagation otherwise clickedOutside gets called too
//     modalOpened = true;
//     e.stopPropagation();
//   }
  
//   $scope.clodeModal = function() {
//     // manual close using button, set boolean to false
//     modalOpened = false;
//   }
  
//   $scope.clickedOutsideModal = function() {
//     // if the modal is open, close it and set the boolean to false
//     if (modalOpened) {
//       $location.path("#close");
//       modalOpened = false;
//     }
//   }
  
//   $scope.clickedInsideModal = function(e) {
//     // do nothing, but stop the propagation
//     e.stopPropagation();
//   }

});

 







// App.directive('modalWindow', function () {
// 	return {
// 		scope: {
// 			yhy : "@"
// 		},
// 		link: function($scope) {
// 			// console.log('last',$scope)
// 		},
// 		template: `this is : {{yhy}}`
// 	}
// });