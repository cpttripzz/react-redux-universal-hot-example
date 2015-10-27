var passport = require('passport');
var config = require('../config');
var jwt = require('jsonwebtoken');

import { login, register, getUsers, newUser } from '../services/user.server.service';

module.exports = function(app) {

    app.post('/login', (req, res) =>{
        login(req)
            .then( (data) => res.json(data) )
            .catch( (err) => res.json(err) )
    });

    app.post('/register',function(req, res) {
        return register(req,res);
    });

    app.get('/new',function(req, res) {
        return res.json(newUser({username: 'admin','email': 'zach.erskine@gmail.com', password: '123456', name: 'Zachary Erskine', roles: 'admin'}));
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
            res.redirect('http://bandaid.com:3000');
        });

    app.get('/logout', function(req, res){
        //req.session.user = null;
        req.logout();
        return res.json({});
    });

    app.post('/loadAuth', (req, res) => {
        // check header or url parameters or post parameters for token

        var token = req.body.token || req.params.token || req.headers['x-access-token'];
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    return res.json({});
                } else {
                    return res.json(decoded);
                }
            });
        } else {
            return res.json({});
        }

    });

    app.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.params.token || req.headers['x-access-token'];
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.jwtSecret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.user = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }

    });
// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
    app.get('/users', (req, res) =>
        getUsers().then( (users) => res.json(users))
    );

    app.post('/resource', function(req, res){
        import { allow } from '../services/resource.server.service';
        if(req.user.role.indexOf('admin') >= 0) {
            allow(req.body)
                .then( (result) => res.json(result))
                .catch( (err) => res.json(err) )

        }
    });
};