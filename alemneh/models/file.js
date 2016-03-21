'use strict';
module.exports = (mongoose, db) => {
  let Schema = mongoose.Schema;
  let fileSchema = Schema({
    _owner: [{ type: String, ref: 'User'}],
    name: String,
    url: String
  });
  let File = mongoose.model('File', fileSchema);
  db.File = File;
};
