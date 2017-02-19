(function () {
  'use strict';

  // Journals controller
  angular
    .module('journals')
    .controller('JournalsController', JournalsController);

  JournalsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'journalResolve'];

  function JournalsController ($scope, $state, $window, Authentication, journal) {
    var vm = this;

    vm.authentication = Authentication;
    vm.journal = journal;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Journal
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.journal.$remove($state.go('journals.list'));
      }
    }

    // Save Journal
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.journalForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.journal._id) {
        vm.journal.$update(successCallback, errorCallback);
      } else {
        vm.journal.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('journals.view', {
          journalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
