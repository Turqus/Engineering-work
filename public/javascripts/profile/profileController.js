App.controller('profileController', function ($scope, $http, ApiService) {

	$scope.init = function (user, board) {
		$scope.toggle = false;
		// $scope.assignedCardsToUser();
		$scope.profile = angular.copy(JSON.parse(user));
		$scope.user = JSON.parse(user);
	};

	// $scope.assignedCardsToUser = function () {
	// 	return ApiService.staff.usercards()
	// 		.then(function (resp) {
	// 			$scope.assignedCards = resp;
	// 			// console.log(resp)
	// 			// $scope.assignedCards.cards = [];
	// 			// for(var i=0; i<$scope.assignedCards.length; i++) {
	// 			// 	for(var j=0; j<$scope.assignedCards.length; j++) {
	// 			// 		if($scope.assignedCards[i]._id == $scope.assignedCards[j]._id) {
	// 			// 			$scope.assignedCards.cards.push($scope.assignedCards[j].boardcards[0]);
	// 			// 		}
	// 			// 	}
	// 			// }
	// 			// console.log($scope.assignedCards)
	// 		})
	// };

	$scope.changeTheDataAboutMe = (profile) => { 
		profile._id = $scope.user._id;
 
		return ApiService.profile.updateInformation(profile)
		.then((resp)=> { 
			$scope.user = profile; 
			$scope.infoMain = resp;
		})
	}

	$scope.changePassword = (pass) => {

		return ApiService.profile.changePassword(pass)
		.then((resp)=> {
			console.log(resp);
		})
	}


	$scope.showFormEditProfile = (profile) => {
		// var params = {
		// 	_id : $scope.user._id,
		// 	firstName: user.firstName,
		// 	surname: user.surname, 
		// 	country: user.country, 
		// 	city: user.city, 
		// 	phone: user.phone, 
		// }
		
		profile._id = $scope.user._id;
 
		return ApiService.profile.updatePersonalInformation(profile)
		.then((resp)=>{
			$scope.info = resp;
			console.log(resp);
		})
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






