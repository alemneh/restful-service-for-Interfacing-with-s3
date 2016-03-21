'use strict';
let AWS = require('aws-sdk');
let s3 = new AWS.S3();


module.exports = (usersRouter, db) => {
  let User = db.User;
  let File = db.File;

  usersRouter.route('/users')
  .get((req, res) => {
    User.find({}, (err, users) => {
      if(err) return res.send(err);
      res.json({data:users});
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
      res.json({data:user});
    });
  })
  .put((req, res) => {
    User.findByIdAndUpdate(req.params.user, req.body, (err, user) => {
      if(err) return res.send(err);
      res.json({msg:'Update was successful!'});
    });
  })
  .delete((req, res) => {
    User.findById(req.params.user, (err, user) => {
      user.files.forEach((file) => {
        File.findById(file, (err, data) => {
          if(err) throw err;
          var params = {Bucket:'401d2-javascript', Key:data.name};
          s3.deleteObject(params, (err, obj) => {
            if(err) throw err;
            data.remove((err, item) => {
              if(err) throw err;
              user.remove((err, user) => {
                if(err) return res.send(err);
                res.send({msg:'Delete was successful!'});
              });
            });
          });
        });

      });

    });
  });

  usersRouter.route('/users/:user/files')
  .get((req, res) => {
    User.findOne({_id: req.params.user})
        .populate('files')
        .exec((err, user) => {
          if(err) throw err;
          res.send('Here is a list of urls for \n'+user.files);
        });
  })
  .post((req, res) => {
    var params = {Bucket: '401d2-javascript', Key: req.body.fileName, Body: req.body.content};
    User.findById(req.params.user, (err, user) => {
      if(err) throw err;
      s3.putObject(params, (err, obj) => {
        console.log('Uploaded');
        s3.getSignedUrl('putObject', params, (err, url) => {
          var newUrl = new File({url: url, _owner: user.name, name:params.Key});
          newUrl.save((err, file) => {
            if(err) throw err;
            user.files.push(file._id);
            User.findByIdAndUpdate(req.params.user, {files:user.files}, (err, user) => {
              if(err) throw err;
              res.send('URL added!');
              res.end();
            });
          });
        });
      });
    });
  });

  usersRouter.route('/users/:user/files/:file')
  .get((req, res) => {
    File.findById(req.params.file, (err, file) => {
      if(err) throw err;
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
      User.findById(req.params.user, (err, user) => {
        var params = {Bucket: '401d2-javascript', Key: file.name};
        s3.deleteObject(params, (err, obj) => {
          file.remove((err, file) => {
            if(err) throw err;
            console.log('Before: '+user.files);
            user.files.pull(file._id);
            console.log('After : '+user.files);
            User.findByIdAndUpdate(req.params.user, {files:user.files}, (err, user) => {
              if(err) throw err;

            });
          });
        });
      });
    });
    res.send('URL deleted!');
  });

};
