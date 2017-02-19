'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Forum = mongoose.model('Forum'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  forum;

/**
 * Forum routes tests
 */
describe('Forum CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Forum
    user.save(function () {
      forum = {
        name: 'Forum name'
      };

      done();
    });
  });

  it('should be able to save a Forum if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Forum
        agent.post('/api/forums')
          .send(forum)
          .expect(200)
          .end(function (forumSaveErr, forumSaveRes) {
            // Handle Forum save error
            if (forumSaveErr) {
              return done(forumSaveErr);
            }

            // Get a list of Forums
            agent.get('/api/forums')
              .end(function (forumsGetErr, forumsGetRes) {
                // Handle Forums save error
                if (forumsGetErr) {
                  return done(forumsGetErr);
                }

                // Get Forums list
                var forums = forumsGetRes.body;

                // Set assertions
                (forums[0].user._id).should.equal(userId);
                (forums[0].name).should.match('Forum name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Forum if not logged in', function (done) {
    agent.post('/api/forums')
      .send(forum)
      .expect(403)
      .end(function (forumSaveErr, forumSaveRes) {
        // Call the assertion callback
        done(forumSaveErr);
      });
  });

  it('should not be able to save an Forum if no name is provided', function (done) {
    // Invalidate name field
    forum.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Forum
        agent.post('/api/forums')
          .send(forum)
          .expect(400)
          .end(function (forumSaveErr, forumSaveRes) {
            // Set message assertion
            (forumSaveRes.body.message).should.match('Please fill Forum name');

            // Handle Forum save error
            done(forumSaveErr);
          });
      });
  });

  it('should be able to update an Forum if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Forum
        agent.post('/api/forums')
          .send(forum)
          .expect(200)
          .end(function (forumSaveErr, forumSaveRes) {
            // Handle Forum save error
            if (forumSaveErr) {
              return done(forumSaveErr);
            }

            // Update Forum name
            forum.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Forum
            agent.put('/api/forums/' + forumSaveRes.body._id)
              .send(forum)
              .expect(200)
              .end(function (forumUpdateErr, forumUpdateRes) {
                // Handle Forum update error
                if (forumUpdateErr) {
                  return done(forumUpdateErr);
                }

                // Set assertions
                (forumUpdateRes.body._id).should.equal(forumSaveRes.body._id);
                (forumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Forums if not signed in', function (done) {
    // Create new Forum model instance
    var forumObj = new Forum(forum);

    // Save the forum
    forumObj.save(function () {
      // Request Forums
      request(app).get('/api/forums')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Forum if not signed in', function (done) {
    // Create new Forum model instance
    var forumObj = new Forum(forum);

    // Save the Forum
    forumObj.save(function () {
      request(app).get('/api/forums/' + forumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', forum.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Forum with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/forums/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Forum is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Forum which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Forum
    request(app).get('/api/forums/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Forum with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Forum if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Forum
        agent.post('/api/forums')
          .send(forum)
          .expect(200)
          .end(function (forumSaveErr, forumSaveRes) {
            // Handle Forum save error
            if (forumSaveErr) {
              return done(forumSaveErr);
            }

            // Delete an existing Forum
            agent.delete('/api/forums/' + forumSaveRes.body._id)
              .send(forum)
              .expect(200)
              .end(function (forumDeleteErr, forumDeleteRes) {
                // Handle forum error error
                if (forumDeleteErr) {
                  return done(forumDeleteErr);
                }

                // Set assertions
                (forumDeleteRes.body._id).should.equal(forumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Forum if not signed in', function (done) {
    // Set Forum user
    forum.user = user;

    // Create new Forum model instance
    var forumObj = new Forum(forum);

    // Save the Forum
    forumObj.save(function () {
      // Try deleting Forum
      request(app).delete('/api/forums/' + forumObj._id)
        .expect(403)
        .end(function (forumDeleteErr, forumDeleteRes) {
          // Set message assertion
          (forumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Forum error error
          done(forumDeleteErr);
        });

    });
  });

  it('should be able to get a single Forum that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Forum
          agent.post('/api/forums')
            .send(forum)
            .expect(200)
            .end(function (forumSaveErr, forumSaveRes) {
              // Handle Forum save error
              if (forumSaveErr) {
                return done(forumSaveErr);
              }

              // Set assertions on new Forum
              (forumSaveRes.body.name).should.equal(forum.name);
              should.exist(forumSaveRes.body.user);
              should.equal(forumSaveRes.body.user._id, orphanId);

              // force the Forum to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Forum
                    agent.get('/api/forums/' + forumSaveRes.body._id)
                      .expect(200)
                      .end(function (forumInfoErr, forumInfoRes) {
                        // Handle Forum error
                        if (forumInfoErr) {
                          return done(forumInfoErr);
                        }

                        // Set assertions
                        (forumInfoRes.body._id).should.equal(forumSaveRes.body._id);
                        (forumInfoRes.body.name).should.equal(forum.name);
                        should.equal(forumInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Forum.remove().exec(done);
    });
  });
});
