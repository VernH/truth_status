'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Forum Schema
 */
var ForumSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Forum name',
    trim: true
  },
  forumPost: {
    type: String,
    default: '',
    required: 'Please fill Forum name',
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
  // like: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('Forum', ForumSchema);
