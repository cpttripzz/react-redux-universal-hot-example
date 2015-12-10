require('../server.babel'); // babel registration (runtime transpilation for node)
var mongoose = require('./config/mongoose');
const pretty = new PrettyError();
var db = mongoose();
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import config from './config';
import PrettyError from 'pretty-error';
import passport from 'passport';
import morgan from 'morgan';

// You can set morgan to log differently depending on your environment

const app = express();
morgan.token('body', function(req, res){ return require('util').inspect(req.body) })

require('./config/passport')(passport);
if (app.get('env') == 'production') {
  app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else {
  app.use(morgan(':method :url :status :req[header] :body'));
}
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./routes/auth')(app);
app.listen(config.apiPort);

