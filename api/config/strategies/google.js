var passport = require('passport'),
    url = require('url'),
    googleStrategy = require('passport-google-oauth2').Strategy;
import config from '../../config';
import { saveOAuthUserProfile } from '../../services/user.server.service';

module.exports = function () {
    passport.use(new googleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            scope: config.google.scope,
        },
        function (req, token, tokenSecret, profile, done) {
            var providerData = profile._json;
            providerData.token = token;
            providerData.tokenSecret = tokenSecret;
            var providerUserProfile = {
                name: profile.displayName,
                username: profile.username,
                provider: 'google',
                providerId: profile.id,
                providerData: providerData
            };
            saveOAuthUserProfile(req, providerUserProfile, done);
        }));
};