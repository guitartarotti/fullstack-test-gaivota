var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var helmet = require('helmet')
var compression = require('compression');
var io = require('socket.io')
var flash = require("connect-flash");
var morgan = require('morgan');
var winston = require('./winston');
var jwt = require("jsonwebtoken");
var mongoUrl = 'mongodb://gaivota:fmXrB2q3drzbGEfJ@cluster0-shard-00-00-ruvyf.mongodb.net:27017,cluster0-shard-00-01-ruvyf.mongodb.net:27017,cluster0-shard-00-02-ruvyf.mongodb.net:27017/projects?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'


module.exports = function() {

    var app = express();

    app.mongoUrl = mongoUrl
    app.JWT_PW = 'ganiwjowko'

    app.set('port', 3000);

    app.use(express.static('./gaivota/public'));
    app.use('/static', express.static(__dirname + './gaivota/public'));
    app.use(multer({dest: './upload/'}).array('file'));
    app.set('view engine', 'ejs');
    app.set('views', 'gaivota/app/views');

    app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
    app.use(bodyParser.json({limit: '2mb'}));
    app.use(express.json({limit: '2mb'}));
    app.use(require('method-override')());

    app.use(session(
        { 
          secret: 'fmXrB2q3drzbGEfJ',
          resave: true,
          saveUninitialized: true,
          store: new MongoStore({ 
            url: mongoUrl,
            autoRemove: 'disabled'
          })
        }
    ));

    app.use(flash());
    //app.use(passport.initialize());
    //app.use(passport.session());
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.hidePoweredBy({ setTo: "PHP 5.5.14"}));
    app.disable('x-powered-by');
    app.use(compression({level: 1}));
    app.use(morgan('combined', { stream: winston.stream }));

    load('models', {cwd: 'gaivota/app'})
     .then('controllers')
     .then('routes')
     .into(app);

    app.get('*', function(req, res) {
        res.status(404).render('404');
    });

    app.codes = []

    return app;
};