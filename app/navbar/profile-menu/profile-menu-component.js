(function () {
  angular.module('app.navbar')
    .component('profileMenu', {
      require: {
        parent: '^navbar'
      },
      controller: function () {

      },
      templateUrl: '/navbar/profile-menu/profile-menu-template.html'
    })
})();



