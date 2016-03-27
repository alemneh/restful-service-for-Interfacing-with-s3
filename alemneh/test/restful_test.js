'use strict';
process.env.MONGO_URI='mongodb://localhost:27017/s3-test';
require('../server');
let mongoose = require('mongoose');
let chai = require('chai');
let chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
let request = chai.request;
let expect = chai.expect;
let db = require('../models');
let User = db.User;
let File = db.File;





describe('RESTful API', function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to create a new user', function(done) {
    chai.request('localhost:3000')
      .post('/users')
      .send({name: 'test'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should get an array of user', function(done) {
    chai.request('localhost:3000')
    .get('/users')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(typeof res.body).to.eql('object');
      expect(Array.isArray(res.body.data)).to.eql(true);

      done();
    });
  });

  describe('Needs an existing user to work with', function() {
    beforeEach(function(done) {
      var testUser = new User({name: 'asefa'});
      testUser.save(function(err, data) {
        if(err) throw err;

        this.testUser = data;
        done();
      }.bind(this));
    });

    it('should be able to make a user in a beforeEach block', function() {
      expect(this.testUser.name).to.eql('asefa');
      expect(this.testUser).to.have.property('_id');
    });

    it('should update a User', function(done) {
      var id = this.testUser._id;
      chai.request('localhost:3000')
      .put('/users/' + id)
      .send({name: 'tesfu'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('Update was successful!');
        done();
      });
    });

    it('should be able to delete a User', function(done) {
      chai.request('localhost:3000')
        .del('/users/' + this.testUser._id)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Delete was successful!');
          done();
        });
    });
  });

  describe('Needs an existing file to work with', function() {
    beforeEach(function(done) {
      var testFile = new File({name: 'fileOne'});
      testFile.save(function(err, data) {
        if(err) throw err;

        this.testFile = data;
        done();
      }.bind(this));
    });

    it('should be able to make a file in a beforeEach block', function() {
      expect(this.testFile.name).to.eql('fileOne');
      expect(this.testFile).to.have.property('_id');
    });

    it('should update a File', function(done) {
      var id = this.testFile._id;
      chai.request('localhost:3000')
      .put('/files/' + id)
      .send({fileName: 'fileTwo'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.text).to.eql('Object updated!');
        done();
      });
    });

    it('should be able to delete a File', function(done) {
      chai.request('localhost:3000')
        .del('/files/' + this.testFile._id)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.text).to.eql('Delete successful!');
          done();
        });
    });
  });
});
