(function () {
  angular.module('app.navbar')
    .component('boardsList', {
      require: {
        parent: '^navbar'
      },
      templateUrl: '/navbar/boards-list/boards-list-template.html'
    })

})();


