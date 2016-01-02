var mongoose = require('mongoose'),
  URLSlugs = require('mongoose-url-slugs'),
  Schema = mongoose.Schema,
  Country = mongoose.model('Country');

var CitySchema = new Schema({
  name: {type: String, trim: true},
  country : { type: Schema.Types.ObjectId, ref: 'Country' }

});


CitySchema.plugin(URLSlugs('name'));
module.exports = mongoose.model('City', CitySchema);