var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
//var io = require('socket.io');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app){

      passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(id, done) {
        Users.findOne(searC, function (err, user) {
          done(err, user);
        });
      });

      passport.use(new LocalStrategy({
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true
        },
        function(req, email, password, done) {
          var tipo = req.body.tipo
          Users.findOne({'email': email}, function (err, user) {
            if(user){
              if(user.senha != password) { return done(err); }
              if(user.senha == password){
                return done(null, user.email);
              }
            } else {
               return done(null, err);
            }
            if (err) { console.log('not'); return done(err); }
          }).lean();
        }
      ));
      
      passport.use('local-signup', new LocalStrategy({
          usernameField : 'email',
          passwordField : 'password',
          passReqToCallback : true
        },
        function(req, email, password, done) {
           process.nextTick(function() {
              
           });
      }));
      
};

