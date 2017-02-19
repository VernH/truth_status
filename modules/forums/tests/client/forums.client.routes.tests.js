(function () {
  'use strict';

  describe('Forums Route Tests', function () {
    // Initialize global variables
    var $scope,
      ForumsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ForumsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ForumsService = _ForumsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('forums');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/forums');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ForumsController,
          mockForum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('forums.view');
          $templateCache.put('modules/forums/client/views/view-forum.client.view.html', '');

          // create mock Forum
          mockForum = new ForumsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Forum Name'
          });

          // Initialize Controller
          ForumsController = $controller('ForumsController as vm', {
            $scope: $scope,
            forumResolve: mockForum
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:forumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.forumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            forumId: 1
          })).toEqual('/forums/1');
        }));

        it('should attach an Forum to the controller scope', function () {
          expect($scope.vm.forum._id).toBe(mockForum._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/forums/client/views/view-forum.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ForumsController,
          mockForum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('forums.create');
          $templateCache.put('modules/forums/client/views/form-forum.client.view.html', '');

          // create mock Forum
          mockForum = new ForumsService();

          // Initialize Controller
          ForumsController = $controller('ForumsController as vm', {
            $scope: $scope,
            forumResolve: mockForum
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.forumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/forums/create');
        }));

        it('should attach an Forum to the controller scope', function () {
          expect($scope.vm.forum._id).toBe(mockForum._id);
          expect($scope.vm.forum._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/forums/client/views/form-forum.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ForumsController,
          mockForum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('forums.edit');
          $templateCache.put('modules/forums/client/views/form-forum.client.view.html', '');

          // create mock Forum
          mockForum = new ForumsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Forum Name'
          });

          // Initialize Controller
          ForumsController = $controller('ForumsController as vm', {
            $scope: $scope,
            forumResolve: mockForum
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:forumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.forumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            forumId: 1
          })).toEqual('/forums/1/edit');
        }));

        it('should attach an Forum to the controller scope', function () {
          expect($scope.vm.forum._id).toBe(mockForum._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/forums/client/views/form-forum.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
