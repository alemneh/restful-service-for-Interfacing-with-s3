'use strict';
module.exports = (mongoose, db) => {
  let fileSchema = mongoose.Schema({
    _owner: [{ type: String, ref: 'User'}],
    url: String
  });
  let File = mongoose.model('File', fileSchema);
  db.File = File;
};
