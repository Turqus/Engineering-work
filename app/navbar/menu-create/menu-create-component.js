(function () {
  angular.module('app.navbar')
    .component('menuCreate', {
      require: {
        parent: '^navbar'
      },
      templateUrl: '/navbar/menu-create/menu-create-template.html'
    })

})();


/*
<!--create board-->
    <div class="menu cb__menu-coordinate menu--create-board" ng-click="blockClosingList($event)" ng-class="{active : $ctrl.parent.name === 'menuCreateBoard' && $ctrl.parent.toggle === true}">
      <span class="settings-menu__header-title">Utwórz Tablicę</span>
       <div class="menu__wrapper--create-board center-block">
               <form action="">
         <div class="form-group">
           <label for="">Tytuł</label>
           <input type="text" class="form-control">
         </div>
          <div class="form-group">
           <label for="">Zespół</label>
           <input type="text" class="form-control">
         </div>
         <span class="bottom--create-board">Ta tablica będzie Prywatna. Zmień</span> 
         <button class="btn btn-success">Utwórz</button>
       </form> 
       </div>
    </div>
    <!---->*/