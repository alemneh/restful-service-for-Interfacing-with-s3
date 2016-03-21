'use strict';
module.exports = (mongoose, db) => {
  let Schema = mongoose.Schema;
  let userSchema = Schema({
    name: String,
    files:[{ type: Schema.Types.ObjectId, ref: 'File' }]
  });
  let User = mongoose.model('User', userSchema);
  db.User = User;
};
