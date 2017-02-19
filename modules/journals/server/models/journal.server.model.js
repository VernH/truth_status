'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Journal Schema
 */
var JournalSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  journalEntry: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Journal', JournalSchema);
