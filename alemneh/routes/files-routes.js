'use strict';
let AWS = require('aws-sdk');
let s3 = new AWS.S3();

module.exports = (filesRouter, db) => {
  let File = db.File;
  let User = db.User;

  filesRouter.route('/files')
  .get((req, res) => {
    File.find({}, (err, files) => {
      if(err) throw err;
      res.json(files);
    });
  })
  .post((req, res) => {
    var params = {Bucket: '401d2-javascript', Key: req.body.fileName, Body: req.body.content};
    s3.putObject(params, (err, obj) => {
      console.log(params.Key);
    });
    s3.getSignedUrl('putObject', params, (err, url) => {
      var newUrl = new File({url:url, name: params.Key});
      newUrl.save((err, data) => {
        if(err) throw err;
        res.json(data);
      });
    });
  });

  filesRouter.route('/files/:file')
  .get((req, res) => {
    File.findById(req.params.file, (err, file) => {
      res.json(file);
    });

  })
  .put((req, res) => {
    File.findById(req.params.file, (err, file) => {
      if(err) throw err;
      var params = {Bucket:'401d2-javascript', Key: file.name, Body: req.body.content};
      s3.putObject(params, (err, obj) => {
        if(err) throw err;
        res.send('Object updated!');
      });
    });
  })
  .delete((req, res) => {
    File.findById(req.params.file, (err, file) => {
      var params = {Bucket: '401d2-javascript', Key: file.name};
      s3.deleteObject(params, (err, obj) => {
        file.remove((err, file) => {
          res.json('Delete successful!');
        });
      });
    });
  });

};
