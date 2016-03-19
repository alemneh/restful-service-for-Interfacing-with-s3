'use strict';
module.exports = (usersRouter, db) {
  let User = db.User;
  let File = db.File;

  usersRouter.route('/users')
  .get((req, res) => {

  })
  .post((req, res) => {

  });

  usersRouter.route('/users/:user')
  .get((req, res) => {

  })
  .put((req, res) => {

  })
  .delete((req, res) => {

  });

  usersRouter.route('/users/:user/files')
  .get((req, res) => {

  })
  .post((req, res) => {

  });

  usersRouter.route('/users/:user/files/:file')
  .get((req, res) => {

  })
  .post((req, res) => {

  });
}
