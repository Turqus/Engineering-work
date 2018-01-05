(function () {
  
  class ComponentCtrl {
    constructor() { 
      
    };



    $onInit() { 
      this.toggle = false;  
       

    };


    activeMenu(name, $event) {
      console.log(name, this.toggle);
      // blockClosingList($event);

      if (this.toggle === true && this.name == name) {
        this.toggle = !this.toggle;
      }
      else if (this.toggle === false) {
        this.toggle = !this.toggle;
      }
      this.name = name;
    };


    // blockClosingList($event) {
    //   $event.stopPropagation();
    // };    
  };

  var MyComponent = {
    bindings: {
      user: '<', 
    },
    controller: ComponentCtrl,
    controllerAs: 'navbar',
    templateUrl: '/navbar/index.html'
  };

  angular.module('app.navbar').component('navbar', MyComponent);
})();

















// (function(){
//   angular.module('app.navbar')
//     .component('navbar', {
//       bindings: {
//         user: '<'
//       },
//       controller: function () {
//         var navbar = this;

//         this.$onInit = function () {
//           navbar.toggle = false;
//         };


//         this.activeMenu = function (name, $event) { 
//           this.blockClosingList($event);
//           if (navbar.toggle === true && navbar.name == name) {
//             navbar.toggle = !navbar.toggle;
//           }
//           else if (navbar.toggle === false) {
//             navbar.toggle = !navbar.toggle;
//           }
//           navbar.name = name;
//         }


//         this.blockClosingList = function ($event) {
//           $event.stopPropagation();
//         }

//       },
//       controllerAs: 'navbar',
//       templateUrl: '/navbar/index.html'
//     })

// })();



