// Journals service used to communicate Journals REST endpoints
(function () {
  'use strict';

  angular
    .module('journals')
    .factory('JournalsService', JournalsService);

  JournalsService.$inject = ['$resource'];

  function JournalsService($resource) {
    return $resource('api/journals/:journalId', {
      journalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
