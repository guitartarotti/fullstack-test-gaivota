var fs = require('fs');
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

module.exports = function() {
	var schema =  mongoose.Schema({
        farm_id: Number,
        name: String,
        latitude: Number,
        longitude: Number,
        culture: String,
        variety: String,
        total_area: Number,
        yield_estimation: Number,
        price: Number,
        ndvis: 
        [
          {
            year: Number,
            array: 
            [
              {
                date: String,
                data: Number
              }
            ]
          }     
        ],
        precipitation: 
        [
          {
            year: Number,
            array: 
            [
              {
                date: String,
                data: Number
              }
            ]
          }     
        ],
        geojson: {
          crs: {
            type: {type: String},
            properties: {
              name: String
            }
          },
          features: 
          [
            {
              type: {type: String},
              properties: {
                g_name: String,
                g_area_ha: String,
                field_id: String
              },
              geometry: {
                type: {type: String},
                coordinates: 
                [
                  [
                    [Number]
                  ]
                ]
              }
            }
          ]
        }
	});

  schema.plugin(findOrCreate);
	return mongoose.model('Farms', schema);
};