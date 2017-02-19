'use strict';

describe('Journals E2E Tests:', function () {
  describe('Test Journals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/journals');
      expect(element.all(by.repeater('journal in journals')).count()).toEqual(0);
    });
  });
});
