'use strict';

module.exorts = (filesRouter, db) => {
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
    var newFile = new File(req.body);
    newFile.save((err, file) => {
      res.json(file);
    });

  });

  filesRouter.route('/files/:file')
  .get((req, res) => {
    File.findById(req.params.file, (err, file) => {
      res.json(file);
    });

  })
  .put((req, res) => {
    File.findByIdAndUpdate(req.params.file, req.body, (err, file) => {
      if(err) return res.send(err);
      res.json('Update successful!');
    });
  })
  .delete((req, res) => {
    File.findById(req.params.file, (err, file) => {
      file.remove((err, file) => {
        res.json('Delete successful!');
      });
    });
  });

};
