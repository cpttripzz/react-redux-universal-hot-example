var passport = require('passport');
var config = require('../config');
var jwt = require('jsonwebtoken');
var multer  = require('multer')
import { login, register, getUsers, newUser, getProfile, postProfile, checkProps } from '../services/user.service';
import { removeStringBeforeLastInstance } from '../../utils/stringUtils'
module.exports = function (app) {

  process.on("unhandledRejection", function (reason, p) {
    console.log("Unhandled", reason, p); // log all your errors, "unsuppressing" them.
    throw reason; // optional, in case you want to treat these as errors
  });

  app.post('/login', (req, res) => {
    login(req)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err))
  });

  app.post('/user/new', function (req, res) {
    newUser(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err))
  });

  app.post('/exists/:entity/', function (req, res) {
    checkProps(req.body)
      .then((result) => res.status((result) ? 500 : 200).json(result))
      .catch((err) => res.status(500).json(err))
  });


  app.get('/oauth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/',
    successRedirect: '/',
    scope: ['email']
  }));

  app.get('/oauth/google',
    passport.authenticate('google', {scope: config.google.scope}),
    function (req, res) {
      // The request will be redirected to Google for authentication, so this
      // function will not be called.
    });

  app.get('/oauth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    function (req, res) {
      let authUser = req.user;
      authUser["token"] = jwt.sign(authUser, config.jwtSecret, {
        expiresIn: 1440 * 60 * 7// expires in 24 hours * 7
      });
      res.redirect('http://bandaid.com:3000/oauth-profile/' + authUser["token"]);
    });

  app.get('/logout', function (req, res) {
    //req.session.user = null;
    req.logout();
    return res.json({});
  });

  //check jwt
  app.use(function (req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.cookies.token;
    if (token) {
      jwt.verify(token, config.jwtSecret, (err, decoded)  => {
        if (err) {
          return res.json({success: false, message: 'Failed to authenticate token.'});
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
  app.post('/loadAuth', (req, res) => res.json(req.user))

  app.get('/users', (req, res) =>
    getUsers().then((users) => res.json(users))
      .catch((err) => res.json(err))
  )

  app.get('/profile', (req, res) =>
    getProfile(req.user._id).then((user) => res.json(user))
      .catch((err) => res.json(err))
  )

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '../../../images')
    },
    filename: function (req, file, cb) {
      let ext = removeStringBeforeLastInstance(file.originalname, '.')
      cb(null,req.user._id + '.' + ext )
    }
  })

  var upload = multer({ storage: storage })
  app.post('/profile', upload.single('imgFile'), function (req, res, next) {
    delete req.body.imgFile
    req.body = JSON.parse(JSON.stringify(req.body));
    postProfile(req).then((user) => res.json(user))
      .catch((err) => res.json(err))
  })


  app.post('/resource', function (req, res) {
    import { allow } from '../services/resource.server.service';
    if (req.user.role.indexOf('admin') >= 0) {
      allow(req.body)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))

    }
  })
};