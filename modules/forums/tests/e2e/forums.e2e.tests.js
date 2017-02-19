'use strict';

describe('Forums E2E Tests:', function () {
  describe('Test Forums page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/forums');
      expect(element.all(by.repeater('forum in forums')).count()).toEqual(0);
    });
  });
});
