(function () {
  angular.module('app.navbar')
    .component('notifications', {
      require: {
        parent: '^navbar'
      },
      templateUrl: '/navbar/notifications/notifications-template.html'
    })

})();



