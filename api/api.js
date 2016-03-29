require('../server.babel'); // babel registration (runtime transpilation for node)
const pretty = new PrettyError();
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import passport from 'passport';
import morgan from 'morgan';

var fs = require("fs");
var mongoose = require('mongoose');
var db = mongoose.connect(config.db.connectionString);

const app = express();
const server = new http.Server(app);


var modelsPath = require('path').join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});


morgan.token('body', (req, res) => require('util').inspect(req.body) )
if (app.get('env') == 'production') {
  app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else {
  app.use(morgan(':method :url :status :req[header] :body'));
}
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

['auth','musician','band'].forEach( route => require('./routes/' + route)(app))


const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}