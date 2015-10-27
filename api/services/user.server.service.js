var User = require('mongoose').model('User');
var passport = require('passport');
var acl = require('acl');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db));
var config = require('../config');
var jwt = require('jsonwebtoken');

export function login(req) {
    let email = req.body.email;
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
                var authUser = {
                    id: user.id,
                    email: user.email
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
                            expiresIn: 1440 * 60// expires in 24 hours
                        });
                        resolve(authUser);
                    });
            });
        }, (err) => {
            reject(err);
        })
    })
};

export function getUsers(req, res) {
    var userMap = [];
    return new Promise((resolve, reject) => {
        var User = require('mongoose').model('User');
        User.find({}).then((users) => {
            users.forEach((user) => {
                //console.log({name: user.name,email: user.email});
                var u = {name: user.name, email: user.email};

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

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

export function register(req, res, next) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function (err) {
        if (err) {
            var message = getErrorMessage(err);
            return res.json(err);
        }

        req.login(user, function (err) {
            if (err)
                return next(err);

            return res.json(user);
        });
    });

};

export function newUser(params) {
    var user = new User(params);
    user.provider = 'local';
    user.save().then(function (user) {
        nodeAcl.addUserRoles(user.id, params.roles || 'user').then(
            function (roles) {
                return user;
            },
            function (err) {
                console.log(err);

            });
    })
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
                                req.session.user = {
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