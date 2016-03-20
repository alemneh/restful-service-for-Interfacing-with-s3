'use strict';
let AWS = require('aws-sdk');
let s3 = new AWS.S3();

s3.listBuckets((err, data) => {
  if(err) throw err;
  console.log(data);
});

module.exports = (usersRouter, db) => {
  let User = db.User;
  let File = db.File;

  usersRouter.route('/users')
  .get((req, res) => {
    User.find({}, (err, users) => {
      if(err) return res.send(err);
      res.json(users);
    });
  })
  .post((req, res) => {
    var newUser = new User(req.body);
    newUser.save((err, user) => {
      if(err) return res.send(err);
      res.json(user);
    });
  });

  usersRouter.route('/users/:user')
  .get((req, res) => {
    User.findById(req.params.user, (err, user) => {
      if(err) return res.send(err);
      res.json(user);
    });
  })
  .put((req, res) => {
    User.findByIdAndUpdate(req.params.user, req.body, (err, user) => {
      if(err) return res.send(err);
      res.send('Update was successful!');
    });
  })
  .delete((req, res) => {
    User.findById(req.params.user, (err, user) => {
      user.remove((err, user) => {
        if(err) return res.send(err);
        res.send('Delete was successful!');
      });
    });
  });

  usersRouter.route('/users/:user/files')
  .get((req, res) => {

  })
  .post((req, res) => {
    var params = {Bucket: '401d2-javascript', Key: req.body.fileName, Body: req.body.content};
    User.findById(req.params.user, (err, user) => {
      if(err) throw err;
      s3.putObject(params, (err, obj) => {
        console.log('Uploaded');
        s3.getSignedUrl('putObject', params, (err, url) => {
          var newUrl = new File({url: url, _owner: user.name});
          newUrl.save((err, data) => {
            if(err) throw err;
            User.findByIdAndUpdate(req.params.user, {files:url}, (err, user) => {
              if(err) throw err;
              res.send('URL added!');
            });
          });
        });
      });
    });
  });

  usersRouter.route('/users/:user/files/:file')
  .get((req, res) => {

  })
  .post((req, res) => {

  });
}
