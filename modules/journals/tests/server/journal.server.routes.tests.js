'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Journal = mongoose.model('Journal'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  journal;

/**
 * Journal routes tests
 */
describe('Journal CRUD tests', function () {

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

    // Save a user to the test db and create new Journal
    user.save(function () {
      journal = {
        name: 'Journal name'
      };

      done();
    });
  });

  it('should be able to save a Journal if logged in', function (done) {
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

        // Save a new Journal
        agent.post('/api/journals')
          .send(journal)
          .expect(200)
          .end(function (journalSaveErr, journalSaveRes) {
            // Handle Journal save error
            if (journalSaveErr) {
              return done(journalSaveErr);
            }

            // Get a list of Journals
            agent.get('/api/journals')
              .end(function (journalsGetErr, journalsGetRes) {
                // Handle Journals save error
                if (journalsGetErr) {
                  return done(journalsGetErr);
                }

                // Get Journals list
                var journals = journalsGetRes.body;

                // Set assertions
                (journals[0].user._id).should.equal(userId);
                (journals[0].name).should.match('Journal name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Journal if not logged in', function (done) {
    agent.post('/api/journals')
      .send(journal)
      .expect(403)
      .end(function (journalSaveErr, journalSaveRes) {
        // Call the assertion callback
        done(journalSaveErr);
      });
  });

  it('should not be able to save an Journal if no name is provided', function (done) {
    // Invalidate name field
    journal.name = '';

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

        // Save a new Journal
        agent.post('/api/journals')
          .send(journal)
          .expect(400)
          .end(function (journalSaveErr, journalSaveRes) {
            // Set message assertion
            (journalSaveRes.body.message).should.match('Please fill Journal name');

            // Handle Journal save error
            done(journalSaveErr);
          });
      });
  });

  it('should be able to update an Journal if signed in', function (done) {
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

        // Save a new Journal
        agent.post('/api/journals')
          .send(journal)
          .expect(200)
          .end(function (journalSaveErr, journalSaveRes) {
            // Handle Journal save error
            if (journalSaveErr) {
              return done(journalSaveErr);
            }

            // Update Journal name
            journal.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Journal
            agent.put('/api/journals/' + journalSaveRes.body._id)
              .send(journal)
              .expect(200)
              .end(function (journalUpdateErr, journalUpdateRes) {
                // Handle Journal update error
                if (journalUpdateErr) {
                  return done(journalUpdateErr);
                }

                // Set assertions
                (journalUpdateRes.body._id).should.equal(journalSaveRes.body._id);
                (journalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Journals if not signed in', function (done) {
    // Create new Journal model instance
    var journalObj = new Journal(journal);

    // Save the journal
    journalObj.save(function () {
      // Request Journals
      request(app).get('/api/journals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Journal if not signed in', function (done) {
    // Create new Journal model instance
    var journalObj = new Journal(journal);

    // Save the Journal
    journalObj.save(function () {
      request(app).get('/api/journals/' + journalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', journal.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Journal with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/journals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Journal is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Journal which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Journal
    request(app).get('/api/journals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Journal with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Journal if signed in', function (done) {
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

        // Save a new Journal
        agent.post('/api/journals')
          .send(journal)
          .expect(200)
          .end(function (journalSaveErr, journalSaveRes) {
            // Handle Journal save error
            if (journalSaveErr) {
              return done(journalSaveErr);
            }

            // Delete an existing Journal
            agent.delete('/api/journals/' + journalSaveRes.body._id)
              .send(journal)
              .expect(200)
              .end(function (journalDeleteErr, journalDeleteRes) {
                // Handle journal error error
                if (journalDeleteErr) {
                  return done(journalDeleteErr);
                }

                // Set assertions
                (journalDeleteRes.body._id).should.equal(journalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Journal if not signed in', function (done) {
    // Set Journal user
    journal.user = user;

    // Create new Journal model instance
    var journalObj = new Journal(journal);

    // Save the Journal
    journalObj.save(function () {
      // Try deleting Journal
      request(app).delete('/api/journals/' + journalObj._id)
        .expect(403)
        .end(function (journalDeleteErr, journalDeleteRes) {
          // Set message assertion
          (journalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Journal error error
          done(journalDeleteErr);
        });

    });
  });

  it('should be able to get a single Journal that has an orphaned user reference', function (done) {
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

          // Save a new Journal
          agent.post('/api/journals')
            .send(journal)
            .expect(200)
            .end(function (journalSaveErr, journalSaveRes) {
              // Handle Journal save error
              if (journalSaveErr) {
                return done(journalSaveErr);
              }

              // Set assertions on new Journal
              (journalSaveRes.body.name).should.equal(journal.name);
              should.exist(journalSaveRes.body.user);
              should.equal(journalSaveRes.body.user._id, orphanId);

              // force the Journal to have an orphaned user reference
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

                    // Get the Journal
                    agent.get('/api/journals/' + journalSaveRes.body._id)
                      .expect(200)
                      .end(function (journalInfoErr, journalInfoRes) {
                        // Handle Journal error
                        if (journalInfoErr) {
                          return done(journalInfoErr);
                        }

                        // Set assertions
                        (journalInfoRes.body._id).should.equal(journalSaveRes.body._id);
                        (journalInfoRes.body.name).should.equal(journal.name);
                        should.equal(journalInfoRes.body.user, undefined);

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
      Journal.remove().exec(done);
    });
  });
});
