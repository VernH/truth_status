(function () {
  'use strict';

  describe('Journals Route Tests', function () {
    // Initialize global variables
    var $scope,
      JournalsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _JournalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      JournalsService = _JournalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('journals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/journals');
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
          JournalsController,
          mockJournal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('journals.view');
          $templateCache.put('modules/journals/client/views/view-journal.client.view.html', '');

          // create mock Journal
          mockJournal = new JournalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Journal Name'
          });

          // Initialize Controller
          JournalsController = $controller('JournalsController as vm', {
            $scope: $scope,
            journalResolve: mockJournal
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:journalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.journalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            journalId: 1
          })).toEqual('/journals/1');
        }));

        it('should attach an Journal to the controller scope', function () {
          expect($scope.vm.journal._id).toBe(mockJournal._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/journals/client/views/view-journal.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          JournalsController,
          mockJournal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('journals.create');
          $templateCache.put('modules/journals/client/views/form-journal.client.view.html', '');

          // create mock Journal
          mockJournal = new JournalsService();

          // Initialize Controller
          JournalsController = $controller('JournalsController as vm', {
            $scope: $scope,
            journalResolve: mockJournal
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.journalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/journals/create');
        }));

        it('should attach an Journal to the controller scope', function () {
          expect($scope.vm.journal._id).toBe(mockJournal._id);
          expect($scope.vm.journal._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/journals/client/views/form-journal.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          JournalsController,
          mockJournal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('journals.edit');
          $templateCache.put('modules/journals/client/views/form-journal.client.view.html', '');

          // create mock Journal
          mockJournal = new JournalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Journal Name'
          });

          // Initialize Controller
          JournalsController = $controller('JournalsController as vm', {
            $scope: $scope,
            journalResolve: mockJournal
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:journalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.journalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            journalId: 1
          })).toEqual('/journals/1/edit');
        }));

        it('should attach an Journal to the controller scope', function () {
          expect($scope.vm.journal._id).toBe(mockJournal._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/journals/client/views/form-journal.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
