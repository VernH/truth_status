(function () {
  'use strict';

  angular
    .module('journals')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Journals',
      state: 'journals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'journals', {
      title: 'List Journals',
      state: 'journals.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'journals', {
      title: 'Create Journal',
      state: 'journals.create',
      roles: ['user']
    });
  }
}());
