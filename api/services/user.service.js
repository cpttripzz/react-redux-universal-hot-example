var User = require('mongoose').model('User');
var passport = require('passport');
var acl = require('acl');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db));
var config = require('../config');
var jwt = require('jsonwebtoken');
import { pick } from '../../utils/objUtils'
import { validateEntityProps, getValidateEntityErrors } from './validation.service'

export function login(req) {
  let { username, password } = req.body;

  var User = require('mongoose').model('User');
  return new Promise((resolve, reject) => {
    User.findOne({username: username}).then((user) => {
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
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
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

export function getProfile(id) {
  return new Promise((resolve, reject) => {
    var User = require('mongoose').model('User');
    User.findById(id).select('id firstName lastName email').lean().then((user) => {
        resolve(user)
      }
      , (err) => reject(err))
  })
}

export function postProfile(req) {
  return new Promise((resolve, reject) => {
    const profile = pick(req.body, 'email', 'firstName', 'lastName')
    User.findOneAndUpdate({_id: req.user.id},profile).then((user) => resolve(getProfile(user.id)), (err) => reject(err))
  })
}

export function exists(req) {
  return new Promise((resolve, reject) => {
    var User = require('mongoose').model('User');
    User.findOne(req).then((result) =>  resolve(result !== null ? {[ Object.keys(req)[0]]: Object.keys(req)[0] + ' already exists'} : false),
      (err) => reject(err))
  })
}
export function checkProps(props) {
  return new Promise((resolve, reject) => {
    propsUnique(props)
      .then(userProps  =>  userProps.filter((prop) =>  prop !== false))
      .then(userPropsNonUnique => {
        let objProps = {}
        if (!userPropsNonUnique.length) return resolve()
        userPropsNonUnique.forEach(prop  => {
          for (let propName in prop) {
            objProps[propName] = prop[propName]
          }
        })
        return reject(objProps);
      })
      .catch((err) => reject(getErrorMessage(err)))
  })
}
var getErrorMessage = function (err) {
  console.log("getErrorMessage", err);
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
    return getValidateEntityErrors(err)
  }
  return message;
};

export function register(req, res, next) {
  return new Promise((resolve, reject) => {
    newUser(req.body).then((user) => {
        req.login(user, (err) => {
          if (err) { reject(err) };
          resolve(user);
        })
      })
      .catch((err) => reject(err))

  })
}
export function propsUnique(objUser) {
  return Promise.all(Object.keys(objUser)
    .filter((prop) => ['email', 'username'].indexOf(prop) >= 0)
    .map((prop) => exists({[prop]: objUser[prop]}))
  )
}
export function newUser(user) {
  return new Promise((resolve, reject) => {

    if (!user.provider) user.provider = 'local'

    validateEntityProps('user', user)
      .then((user) => {
        propsUnique(user)
          .then(userProps  =>  userProps.filter((prop) =>  prop !== false))
          .then(userPropsNonUnique => {
            if (userPropsNonUnique.length) return reject(userPropsNonUnique)
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


export function saveOAuthUserProfile(req, profile, done) {
  User.findOne({
      provider: profile.provider,
      providerId: profile.providerId
    },
    function (err, user) {
      if (err) {
        return done(err);
      } else {
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
              req.user = {
                id: user.id,
                email: user.email || null,
                username: possibleUsername,
              };
              return done(err, user);
            });
          })
        } else {
          return done(err, user);
        }
      }
    })
}


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