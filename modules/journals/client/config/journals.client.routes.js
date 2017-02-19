(function () {
  'use strict';

  angular
    .module('journals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('journals', {
        abstract: true,
        url: '/journals',
        template: '<ui-view/>'
      })
      .state('journals.list', {
        url: '',
        templateUrl: 'modules/journals/client/views/list-journals.client.view.html',
        controller: 'JournalsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Journals List'
        }
      })
      .state('journals.create', {
        url: '/create',
        templateUrl: 'modules/journals/client/views/form-journal.client.view.html',
        controller: 'JournalsController',
        controllerAs: 'vm',
        resolve: {
          journalResolve: newJournal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Journals Create'
        }
      })
      .state('journals.edit', {
        url: '/:journalId/edit',
        templateUrl: 'modules/journals/client/views/form-journal.client.view.html',
        controller: 'JournalsController',
        controllerAs: 'vm',
        resolve: {
          journalResolve: getJournal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Journal {{ journalResolve.name }}'
        }
      })
      .state('journals.view', {
        url: '/:journalId',
        templateUrl: 'modules/journals/client/views/view-journal.client.view.html',
        controller: 'JournalsController',
        controllerAs: 'vm',
        resolve: {
          journalResolve: getJournal
        },
        data: {
          pageTitle: 'Journal {{ journalResolve.name }}'
        }
      });
  }

  getJournal.$inject = ['$stateParams', 'JournalsService'];

  function getJournal($stateParams, JournalsService) {
    return JournalsService.get({
      journalId: $stateParams.journalId
    }).$promise;
  }

  newJournal.$inject = ['JournalsService'];

  function newJournal(JournalsService) {
    return new JournalsService();
  }
}());
