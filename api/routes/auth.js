var passport = require('passport');
var config = require('../config');
var jwt = require('jsonwebtoken');

import { login, register, getUsers, newUser, getProfile, postProfile, checkProps } from '../services/user.service';

module.exports = function(app) {

    process.on("unhandledRejection", function(reason, p){
        console.log("Unhandled", reason, p); // log all your errors, "unsuppressing" them.
        throw reason; // optional, in case you want to treat these as errors
    });

    app.post('/login', (req, res) =>{
        login(req)
            .then( (data) => res.json(data) )
            .catch( (err) => res.status(500).json(err) )
    });

    app.post('/user/new',function(req, res) {
            newUser(req.body)
              .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err))
    });

    app.post('/exists/:entity/',function(req, res) {
        checkProps(req.body)
        .then( (result) => res.status((result)?500:200).json(result))
          .catch( (err) => res.status(500).json(err) )
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
            let authUser = req.user;
            authUser["token"] = jwt.sign(authUser, config.jwtSecret, {
                expiresIn: 1440 * 60 * 7// expires in 24 hours * 7
            });
            res.redirect('http://bandaid.com:3000/oauth-profile/'+authUser["token"]);
        });

    app.get('/logout', function(req, res){
        //req.session.user = null;
        req.logout();
        return res.json({});
    });

    app.post('/loadAuth', (req, res) => {
        // check header or url parameters or post parameters for token

        var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.cookies.token
        // decode token
        console.log('token',token)
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    return res.json({});
                } else {
                    decoded.token = token;
                    return res.json(decoded);
                }
            });
        } else {
            return res.json({});
        }

    });

    app.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.cookies.token;
        console.log('token',token)

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.jwtSecret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.user = decoded;
                    //console.log('jwt', req.user);
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
        .catch((err) => res.json(err))

    )

    app.get('/profile', (req, res) =>
          getProfile(req).then((user) => res.json(user))
            .catch((err) => res.json(err))

    )

    app.post('/profile', (req, res) =>
      postProfile(req).then((user) => res.json(user))
        .catch((err) => res.json(err))
    )


    app.post('/resource', function(req, res){
        import { allow } from '../services/resource.server.service';
        if(req.user.role.indexOf('admin') >= 0) {
            allow(req.body)
                .then( (result) => res.json(result))
                .catch( (err) => res.json(err) )

        }
    })
};