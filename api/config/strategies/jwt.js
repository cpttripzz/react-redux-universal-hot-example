var passport = require('passport'),
    url = require('url'),
    JwtStrategy = require('passport-jwt').Strategy;
import config from '../../config';
var opts = {};
opts.secretOrKey = config.jwtSecret;
opts.issuer = "bandaid.com";
opts.audience = "bandaid.com";
module.exports = function () {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
                // or you could create a new account 
            }
        });
    }));
};
