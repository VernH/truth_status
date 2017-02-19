(function () {
  'use strict';

  angular
    .module('forums')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Forums',
      state: 'forums',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'forums', {
      title: 'List Forums',
      state: 'forums.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'forums', {
      title: 'Create Forum',
      state: 'forums.create',
      roles: ['user']
    });
  }
}());
