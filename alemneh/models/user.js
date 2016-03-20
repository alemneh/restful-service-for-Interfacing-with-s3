'use strict';
module.exports = (mongoose, db) => {
  let userSchema = mongoose.Schema({
    name: String,
    files:[{ type: String, ref: 'File' }]
  });
  let User = mongoose.model('User', userSchema);
  db.User = User;
};
