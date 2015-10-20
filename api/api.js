require('../server.babel'); // babel registration (runtime transpilation for node)
var mongoose = require('./config/mongoose');
const pretty = new PrettyError();
var db = mongoose();
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from './config';
import PrettyError from 'pretty-error';
import passport from 'passport';
const app = express();
require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./routes/auth')(app);
app.listen(config.apiPort);

