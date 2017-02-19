'use strict';

/**
 * Module dependencies
 */
var journalsPolicy = require('../policies/journals.server.policy'),
  journals = require('../controllers/journals.server.controller');

module.exports = function(app) {
  // Journals Routes
  app.route('/api/journals').all(journalsPolicy.isAllowed)
    .get(journals.list)
    .post(journals.create);

  app.route('/api/journals/:journalId').all(journalsPolicy.isAllowed)
    .get(journals.read)
    .put(journals.update)
    .delete(journals.delete);

  // Finish by binding the Journal middleware
  app.param('journalId', journals.journalByID);
};
