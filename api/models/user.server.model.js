var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: {
    type: String,
    trim: true,
    unique: true
  },
  password: String,
  provider: String,
  providerId: String,
  photo: String
});

UserSchema.pre('save',
  function (next) {
    if (this.password) {
      var md5 = crypto.createHash('md5');
      this.password = md5.update(this.password).digest('hex');
    }

    next();
  }
);

// Pre hook for `findOneAndUpdate`
UserSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true;
  next();
});

UserSchema.methods.authenticate = function (password) {
  var md5 = crypto.createHash('md5');
  md5 = md5.update(password).digest('hex');

  return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');

  _this.findOne(
    {username: possibleUsername},
    function (err, user) {
      if (!err) {
        if (!user) {
          callback(possibleUsername);
        }
        else {
          return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
      }
      else {
        callback(null);
      }
    }
  );
};

module.exports = mongoose.model('User', UserSchema);