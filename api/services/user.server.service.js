var User = require('mongoose').model('User');
var	passport = require('passport');
var acl = require('acl');
var mongoose = require('mongoose');
var nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db));
var config = require('../config');
var jwt = require('jsonwebtoken');
export function login (req, res){
	let email = req.body.email;
	let password = req.body.password;
	var User = require('mongoose').model('User');
	User.findOne({email: email},
		function(err, user) {

			if (err) {
				return res.status(500).json(err.message);
			}
			let errMsg = {message: 'Invalid username or password'};
			if (!user) {
				return res.status(500).json(errMsg);
			}

			if (!user.authenticate(password)) {
				return res.status(500).json(errMsg);
			}
			req.login(user, function (err) {
				if (err) {
					res.json({loginError:err});
				}

				nodeAcl.userRoles(user.id,function(err, roles) {
					if(err){
						console.log('node acl errrrrror', err);
					}

					var authUser = {
						id: user.id,
						email: user.email,
						role: roles
					};
					var token = jwt.sign(authUser, config.jwtSecret, {
						expiresIn: 1440 * 60// expires in 24 hours
					});
					if (token) {
						authUser["token"] = token;
					}
					return res.json({authUser});
				});

			});
		}
	);
};

var getErrorMessage = function(err) {
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
	if (!req.user) {
		var user = new User(req.body);
		var message = null;
		user.provider = 'local';
		user.save(function(err) {
			if (err) {
				var message = getErrorMessage(err);
				return res.json(err);
			}

			req.login(user, function(err) {
				if (err)
					return next(err);

				return  res.json(user);
			});
		});
	}
	else {
		return  res.json(user);
	}
};

export function logout(req, res) {
	req.logout();
};

export function saveOAuthUserProfile (req, profile, done) {
	User.findOne({
			provider: profile.provider,
			providerId: profile.providerId
		},
		function(err, user) {
			if (err) {
				return done(err);
			}
			else {
				if (!user) {
					var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						profile.username = availableUsername;
						user = new User(profile);

						user.save(function(err) {
							if (err) {
								var message = _this.getErrorMessage(err);
								console.log(message);
							}
							let roles = ['user'];
							nodeAcl.addUserRoles( user.id, roles,function(err) {
								if(err){
									console.log(err);
								}
								req.session.user = {
									id: user.id,
									email: user.email || null,
									username: possibleUsername,
									role: roles
								};
								return done(err, user);
							} );
						});
					});
				}
				else {
					nodeAcl.userRoles(user.id,function(err, roles) {
						if(err){
							console.log('node acl errrrrror', err);
						}
						console.log(req.session);
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