(function () {
  angular.module('app.navbar')
    .component('menuCreate', {
      require: {
        parent: '^navbar'
      },
      templateUrl: '/navbar/menu-create/menu-create-template.html'
    })

})();


