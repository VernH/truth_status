'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Journal = mongoose.model('Journal'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Journal
 */
exports.create = function(req, res) {
  var journal = new Journal(req.body);
  journal.user = req.user;

  journal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(journal);
    }
  });
};

/**
 * Show the current Journal
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var journal = req.journal ? req.journal.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  journal.isCurrentUserOwner = req.user && journal.user && journal.user._id.toString() === req.user._id.toString();

  res.jsonp(journal);
};

/**
 * Update a Journal
 */
exports.update = function(req, res) {
  var journal = req.journal;

  journal = _.extend(journal, req.body);

  journal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(journal);
    }
  });
};

/**
 * Delete an Journal
 */
exports.delete = function(req, res) {
  var journal = req.journal;

  journal.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(journal);
    }
  });
};

/**
 * List of Journals
 */
exports.list = function(req, res) {
  Journal.find().sort('-created').populate('user', 'displayName').exec(function(err, journals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(journals);
    }
  });
};

/**
 * Journal middleware
 */
exports.journalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Journal is invalid'
    });
  }

  Journal.findById(id).populate('user', 'displayName').exec(function (err, journal) {
    if (err) {
      return next(err);
    } else if (!journal) {
      return res.status(404).send({
        message: 'No Journal with that identifier has been found'
      });
    }
    req.journal = journal;
    next();
  });
};
