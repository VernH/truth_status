(function () {
  'use strict';

  angular
    .module('journals')
    .controller('JournalsListController', JournalsListController);

  JournalsListController.$inject = ['JournalsService', '$window'];

  function JournalsListController(JournalsService, $window) {
    var vm = this;
    vm.user = $window.user;
    vm.journals = JournalsService.query();
  }
}());
