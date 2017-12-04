const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true, select: false},
  pushoverKey: String
});

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);