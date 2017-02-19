(function () {
  'use strict';

  angular
    .module('forums')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('forums', {
        abstract: true,
        url: '/forums',
        template: '<ui-view/>'
      })
      .state('forums.list', {
        url: '',
        templateUrl: 'modules/forums/client/views/list-forums.client.view.html',
        controller: 'ForumsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Forums List'
        }
      })
      .state('forums.create', {
        url: '/create',
        templateUrl: 'modules/forums/client/views/form-forum.client.view.html',
        controller: 'ForumsController',
        controllerAs: 'vm',
        resolve: {
          forumResolve: newForum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Forums Create'
        }
      })
      .state('forums.edit', {
        url: '/:forumId/edit',
        templateUrl: 'modules/forums/client/views/form-forum.client.view.html',
        controller: 'ForumsController',
        controllerAs: 'vm',
        resolve: {
          forumResolve: getForum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Forum {{ forumResolve.name }}'
        }
      })
      .state('forums.view', {
        url: '/:forumId',
        templateUrl: 'modules/forums/client/views/view-forum.client.view.html',
        controller: 'ForumsController',
        controllerAs: 'vm',
        resolve: {
          forumResolve: getForum
        },
        data: {
          pageTitle: 'Forum {{ forumResolve.name }}'
        }
      });
  }

  getForum.$inject = ['$stateParams', 'ForumsService'];

  function getForum($stateParams, ForumsService) {
    return ForumsService.get({
      forumId: $stateParams.forumId
    }).$promise;
  }

  newForum.$inject = ['ForumsService'];

  function newForum(ForumsService) {
    return new ForumsService();
  }
}());
