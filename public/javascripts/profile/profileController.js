App.controller('profileController', function ($scope, $http, ApiService) {

	$scope.init = function (user, board) {
		$scope.toggle = false;
		// $scope.assignedCardsToUser();
		$scope.user = JSON.parse(user);
	};

	// $scope.assignedCardsToUser = function () {
	// 	return ApiService.staff.usercards()
	// 		.then(function (resp) {
	// 			$scope.assignedCards = resp;
	// 			console.log(typeof ($scope.assignedCards[0].boardcards.Author))
	// 		})
	// };

	$scope.changeTheDataAboutMe = (user) => {
		var params = {
			_id : $scope.user._id,
			firstName: user.firstName,
			surname: user.surname,
			initials: user.initials, 
			biography: user.biography
		}
 
		return ApiService.profile.updateInformation(params);
	}


	$scope.showFormEditProfile = (user) => {
		var params = {
			_id : $scope.user._id,
			firstName: user.firstName,
			surname: user.surname, 
			country: user.country, 
			city: user.city, 
			phone: user.phone, 
		}
 
		return ApiService.profile.updatePersonalInformation(params);
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




// $scope.showFormeditProfile 
// 		const menu = document.querySelector('.panel-header__heading-form');
// 		const information = document.querySelector('.panel-header__option');
// 		const cancel = document.querySelector('.cancel-edit-profile');

// 		menu.classList.toggle('active');
// 		information.classList.toggle('active');
// 		cancel.classList.toggle('active');


	// $scope.openMenu = function (whichMenu) {

	// 	// var x = document.getElementsByClassName("settings-menu");
	// 	// angular.forEach( x , function ( value , key ) {
	// 	// 	x[key].style.display = "none";
	// 	// })

	// 	var menu = document.querySelector('.' + whichMenu);
	// 	menu.classList.toggle('active');

	// 	window.addEventListener('click', function (evt) {
	// 		let target = evt.target;
	// 		if (target !== menu && target.contains(menu) && menu.classList.contains('active')) {
	// 			menu.classList.remove('active');
	// 		}
	// 	});
	// }
});






