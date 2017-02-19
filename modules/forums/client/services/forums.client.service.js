// Forums service used to communicate Forums REST endpoints
(function () {
  'use strict';

  angular
    .module('forums')
    .factory('ForumsService', ForumsService);

  ForumsService.$inject = ['$resource'];

  function ForumsService($resource) {
    return $resource('api/forums/:forumId', {
      forumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
