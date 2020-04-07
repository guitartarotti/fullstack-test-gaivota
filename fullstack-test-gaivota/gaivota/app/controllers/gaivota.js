module.exports = function(app) {
    var mongo = require('mongodb');
    var querystring = require('querystring');
    var fs = require('fs');
    var async = require('async')
    var _eval = require('eval')
    var passport = require('passport');
    var moment = require('moment');
    var ObjectId = require('mongodb').ObjectID;
    var io = require('socket.io');
    var crypto = require('crypto')
    var winston = require('winston')
    var jwt = require("jsonwebtoken");
    const { PORT, JWT_PW } = process.env;

    // Models
    var Users = app.models.users;
    var Farms = app.models.farms;

    // Controllers
    var controller = {};

    controller.login = function(){
      var { email, password } = req.body;
      Users.findOne({'email': email}, function (err, user) {
            if(user){
              if(user.senha != password) { return err; }
              if(user.senha == password){
                var token = jwt.sign(user, JWT_PW);
                res.status(200).send({ userData: user, token });
              }
            } else {
               return err;
            }
            if (err) { console.log('not'); return err; }
      }).lean();
      
    }

    controller.getFazendas = function(req, res){
       var head = req.headers
       var Query = app.models.farms.find()
       Query.select('-ndvis -precipitation'); 
       
       Query.exec(function (err, product) {
         if (!err) {
             return res.json(product);
         } else {
             return res.send([500]);
         }
       });
    }

    controller.postFazendas = function(req, res){
       
    }

    controller.getFazenda = function(req, res){
       var id = req.params.id
       console.log(req.params)
       Farms.findOne({'farm_id': id}).lean().exec()
        .then(
          function(farm) {
            res.json([farm])
          }
        )
    }

    controller.postFazenda = function(req, res){
       
    }

    controller.getBuy = function(req, res){
       var id = req.params.id
       console.log(req.params)
       Farms.findOne({'farm_id': id}).lean().exec()
        .then(
          function(farm) {
            res.json([farm])
          }
        )
    }

    controller.postBuy = function(req, res){
       
    }

    controller.encode = function(req, res){
       var number = req.params.number.match(':(.*)')
 
       var hash = crypto
           .createHmac('sha256', Buffer.from(app.secret, 'hex'))
          .update(number[1])
          .digest('hex');

       var first6HexCharacters = hash.slice(0, 6);
       var int = parseInt(first6HexCharacters, 16) % 10000;
       let code = int.toString();

       code =
         Array(6- code.length)
                .fill(0)
                .join('') + code;

       app.codes.push({code: code, number: number[1]})
       res.json([code])
    }

    controller.decode = function(req, res){
       var code = req.params.code.match(':(.*)')
       var number = app.codes[app.codes.findIndex(x=> x.code == code[1])].number
       res.json([number])
    }


    // Algoritimo de refatoração de dados

    controller.refactorDate = function(req, res){
       var farms = require("./data/farms.json");
       var farmsNdvi = require("./data/farms_ndvi.json");
       var farmsPreciptation = require("./data/farms_preciptation.json");

       var generateData = function(farm_id, array, term){
        var newData = []
        var serach = term + '_' + farm_id
        var inputNdvi = function(number, year, date){
           if(newData.findIndex(x=> x.year == year) == -1){
             newData.push({year: year, array: [{date: date, data: number}]})
           } else {
             newData[newData.findIndex(x=> x.year == year)].array.push({date: date, data: number})
           }
        }

        for (var ii = 0; ii < array.length; ii++) {
          if(typeof array[ii][serach] != "number"){
            var str = array[ii][serach]
            str = str.replace(/,/g, '.');
            inputNdvi(Number(str), new Date(array[ii].date).getFullYear(), array[ii].date)
          } else {
            inputNdvi(array[ii][serach], new Date(array[ii].date).getFullYear(), array[ii].date)
          }
        }

        return newData
       }

       for (var i = 0; i < farms.length; i++) {
         farms[i].ndvis = generateData(farms[i].farm_id, farmsNdvi, 'ndvi')
         farms[i].precipitation = generateData(farms[i].farm_id, farmsPreciptation, 'precipitation')
         Farms.findOneAndUpdate(
           {'farm_id': farms[i].farm_id},
           {$set: farms[i]},
           {safe: true, upsert: true, new : false},
           function(err, model) {
               if(err){winston.log('error', err)}
           }
         );
       }

       res.json([{success: true, farms_create: farms.length, date: new Date(), auth_require: false}])

    }

    controller.refactorGeo = function(req, res){
       var geo = [{farm_id: 221, data: require("./data/farm_221.json")}, {farm_id: 231, data: require("./data/farm_231.json")}, {farm_id: 271, data: require("./data/farm_271.json")}]

       for (var i = 0; i < geo.length; i++) {
         delete geo[i].data.type
         Farms.findOneAndUpdate(
           {'farm_id': geo[i].farm_id},
           {$set: {geojson: geo[i].data}},
           {safe: true, upsert: true, new : false},
           function(err, model) {
               if(err){winston.log('error', err)}
           }
         );
       }

       res.json([{success: true, farms_geo_update: geo.length, date: new Date(), auth_require: false}])
    }

    return controller
}