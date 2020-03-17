var fs = require('fs');
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

module.exports = function() {
	var schema =  mongoose.Schema({
         email: {
            type: String,
            require: true,
            index:{
               unique: true
            }
         },
         senha: {
            type: String,
            require: true
         },
         nome: {
            type: String,
            require: true
         },
         data: {
            type: Date, 
            default: Date.now
         },
         history: {
           fazendas: [{
            date: String
           }],
           lists: [{
            date: String,
            farm_id: String
           }],
           buys: [{
            date: String,
            farm_id: String,
            price: String,
            yield: String,
            metod: String,
            card: {
              card_number: String,
              name_card: String
            },
            paypay: {
              email: String,
              password: String
            }
           }]
         }
	});

  schema.plugin(findOrCreate);
	return mongoose.model('Users', schema);
};