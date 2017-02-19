(function () {
  'use strict';

  // Forums controller
  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'forumResolve'];

  function ForumsController ($scope, $state, $window, Authentication, forum) {
    var vm = this;

    vm.authentication = Authentication;
    vm.forum = forum;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Forum
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.forum.$remove($state.go('forums.list'));
      }
    }

    // Save Forum
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.forumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.forum._id) {
        vm.forum.$update(successCallback, errorCallback);
      } else {
        vm.forum.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('forums.view', {
          forumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
