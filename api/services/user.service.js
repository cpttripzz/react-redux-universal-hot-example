var User = require('mongoose').model('User');
var passport = require('passport');
var acl = require('acl');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db));
var config = require('../config');
var jwt = require('jsonwebtoken');
export function login(req) {
  let username = req.body.username;
  let password = req.body.password;
  var User = require('mongoose').model('User');
  return new Promise((resolve, reject) => {
    User.findOne({email: email}).exec().then((user) => {
      let errMsg = {message: 'Invalid username or password'};
      if (!user || (!user.authenticate(password))) {
        reject(errMsg);
      }

      req.login(user, (err) => {
        if (err) {
          reject({loginError: err});
        }
        console.log(user);
        return resolve(getUserDetails(user));
      });
    }, (err) => {
      reject(err);
    })
  })
};

export function getUserDetails(user) {
  return new Promise((resolve, reject) => {

    let authUser = {
      id: user.id,
      email: user.email,
      username: user.username
    };
  //function (users) { return users[0]; }
  //users => users[0]
  nodeAcl.userRoles(user.id)
    .then((roles) => {
        authUser['roles'] = roles;
        return nodeAcl.whatResources(roles)
      }
    )
    .then((resources) => {
      authUser['resources'] = resources;
      authUser["token"] = jwt.sign(authUser, config.jwtSecret, {
        expiresIn: 1440 * 60 * 7// expires in 24 hours * 7
      });
      resolve(authUser);
    })
    .catch((err) => reject(getErrorMessage(err)))
  })
}
export function getUsers(req, res) {
  var userMap = [];
  return new Promise((resolve, reject) => {
    var User = require('mongoose').model('User');
    User.find({}).then((users) => {
      users.forEach((user) => {
        //console.log({name: user.name,email: user.email});
        var u = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };

        nodeAcl.userRoles(user.id).then((roles) => {
          u.roles = roles;
        });
        userMap.push(u);
      });
      resolve(userMap);
    }, (err) => {
      reject(err)
    })
  })
}

export function getProfile(req) {
  console.log(req.user.id);
  var objectId = (require('mongoose').Types.ObjectId);

  return new Promise((resolve, reject) => {
    var User = require('mongoose').model('User');
    User.findById(req.user.id).then((user) => {
        var u = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };
        console.log('fff',user)
        resolve(user)
      }
      , (err) => reject(err))
  })
}

export function postProfile(req) {
  var objectId = (require('mongoose').Types.ObjectId);
  const profile = Object.keys(req.body).filter((prop) => ['email','firstName', 'lastName'].indexOf(prop) >= 0 )
  return new Promise((resolve, reject) => {
    var User = require('mongoose').model('User');
    User.findById(req.user.id).then((user) => {
      profile.map((prop) => {
        user[prop] = profile[prop]
      })
        user.save( (err)  =>{
          if (err) return handleError(err);
          resolve(user)
        });
      }
      , (err) => reject(err))
  })
}

export function exists(req) {
  return new Promise((resolve, reject) => {
    var User = require('mongoose').model('User');
    User.findOne(req).then((result) =>  resolve( result !== null ? {[ Object.keys(req)[0]] : Object.keys(req)[0] + ' already exists'  } : false),
      (err) => reject(err))
  })
}
export function checkProps(props){
  return new Promise((resolve, reject) => {
    propsUnique(props)
      .then(userProps  =>  userProps.filter((prop) =>  prop !== false))
      .then(userPropsNonUnique => {
        let objProps = {}
        if (userPropsNonUnique.length === 0) return resolve()
        userPropsNonUnique.forEach(prop  => {
          for (let propName in prop){
            objProps[propName] = prop[propName]
          }
        })
        return reject(objProps);
      })
      .catch((err) => reject(getErrorMessage(err)))
  })
}
var getErrorMessage = function (err) {
  console.log("getErrorMessage",err);
  let message = '';
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    return err.map(err =>  { return {[err.path.replace(/\#\//i, '')]: err.message} } )
  }
  return message;
};

export function register(req, res, next) {
  return new Promise((resolve, reject) => {
    newUser(req.body).then((user) => {
      req.login(user, (err) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      })
    })
      .catch((err) => reject(err))

  })
}
export function propsUnique(objUser){
  return Promise.all(Object.keys(objUser)
    .filter((prop) => ['email','username'].indexOf(prop) >= 0 )
    .map( (prop) => exists({[prop]: objUser[prop]}) )
  )
}
export function newUser(user) {
  return new Promise((resolve, reject) => {

    if (!user.provider) user.provider = 'local';
    validateUser(user)
      .then((user) => {
        propsUnique(user)
          .then(userProps  =>  userProps.filter( (prop) =>  prop !== false ))
          .then(userPropsNonUnique => {
            if(userPropsNonUnique.length) return reject(userPropsNonUnique)
            const objUser = new User(user)
            objUser.save(user).then(
              (user) => resolve(getUserDetails(user)),
              (err) => reject(getErrorMessage(err))
            )
          })
      })
      .catch((err) => reject(getErrorMessage(err)))

    //user.save()
    //  .then((user) => {
    //    console.log(user);
    //    nodeAcl.addUserRoles(user.id, params.roles || 'user').then(
    //      (roles) => resolve(user),
    //      (err) => reject(err)
    //    )
    //  })
    //  .catch((err) => reject(err))
  })
}

export function validateUser(user) {
  import validate from  '../../utils/validate';
  var readFile = require("bluebird").promisify(require("fs").readFile);
  return new Promise((resolve, reject) => {
    readFile(__dirname + '/../models/validators/user.schema.json')
      .then((schema) => JSON.parse(schema))
      .then((schema) => validate(user, schema))
      .then((user) => resolve(user))
      .catch((err) =>  reject(err))
  });
}
export function logout(req, res) {
  req.logout();
};

export function saveOAuthUserProfile(req, profile, done) {
  User.findOne({
      provider: profile.provider,
      providerId: profile.providerId
    },
    function (err, user) {
      if (err) {
        return done(err);
      }
      else {
        if (!user) {
          var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            profile.username = availableUsername;
            user = new User(profile);

            user.save(function (err) {
              if (err) {
                var message = _this.getErrorMessage(err);
                console.log(message);
              }
              let roles = ['user'];
              nodeAcl.addUserRoles(user.id, roles, function (err) {
                if (err) {
                  console.log(err);
                }
                req.user = {
                  id: user.id,
                  email: user.email || null,
                  username: possibleUsername,
                  role: roles
                };
                return done(err, user);
              });
            });
          });
        }
        else {
          nodeAcl.userRoles(user.id, function (err, roles) {
            if (err) {
              console.log('node acl errrrrror', err);
            }
            //req.session.user = {
            //	id: user.id,
            //	email: user.email || null,
            //	username: possibleUsername,
            //	role: roles
            //};
          });
          return done(err, user);
        }
      }
    }
  );
};


//exports.create = function(req, res, next) {
//	var user = new User(req.body);
//	user.save(function(err) {
//		if (err) {
//			return next(err);
//		}
//		else {
//			res.json(user);
//		}
//	});
//};
//
//exports.list = function(req, res, next) {
//	User.find({}, function(err, users) {
//		if (err) {
//			return next(err);
//		}
//		else {
//			res.json(users);
//		}
//	});
//};
//
//exports.read = function(req, res) {
//	res.json(req.user);
//};
//
//exports.userByID = function(req, res, next, id) {
//	User.findOne({
//			_id: id
//		},
//		function(err, user) {
//			if (err) {
//				return next(err);
//			}
//			else {
//				req.user = user;
//				next();
//			}
//		}
//	);
//};
//
//exports.update = function(req, res, next) {
//	User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
//		if (err) {
//			return next(err);
//		}
//		else {
//			res.json(user);
//		}
//	});
//};
//
//exports.delete = function(req, res, next) {
//	req.user.remove(function(err) {
//		if (err) {
//			return next(err);
//		}
//		else {
//			res.json(req.user);
//		}
//	})
//};