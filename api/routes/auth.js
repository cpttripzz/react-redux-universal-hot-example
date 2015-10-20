var passport = require('passport');
var config = require('../config');
import { login, register } from '../services/user.server.service';

module.exports = function(app) {

    app.post('/login',function(req, res) {
        return login(req,res);
    });

    app.post('/register',function(req, res) {
        return register(req,res);
    });

    app.get('/loadAuth', function(req, res) {
        //if(req.session.user) {
        //    return res.json(req.session.user);
        //} else {
            return res.json({});
        //}
    });
    app.get('/oauthSuccess',
        function(req, res){
            return res.render('oauthSuccess');
        });
    app.get('/oauth/facebook', passport.authenticate('facebook', {
        scope:['email']
    }));

    app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/',
        successRedirect: '/',
        scope:['email']
    }));

    app.get('/oauth/google',
        passport.authenticate('google', { scope: config.google.scope }),
        function(req, res){
            // The request will be redirected to Google for authentication, so this
            // function will not be called.
        });

    app.get('/oauth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            console.log('cookie',req.get('cookie'));
            res.redirect('http://bandaid.com:3000');
        });

    app.get('/logout', function(req, res){
        //req.session.user = null;
        req.logout();
        return res.json({});
    });
};