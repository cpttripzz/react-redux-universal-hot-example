let mongoose = require('mongoose')
let URLSlugs = require('mongoose-url-slugs')
let Schema = mongoose.Schema
let Association = mongoose.model('Association')
let Musician = mongoose.model('Musician')


var BandVacancySchema = new Schema({
  name: {type: String, trim: true},
  description: {type: String, trim: true},
  genres : { type: Schema.Types.ObjectId, ref: 'Genre' },

});


BandVacancySchema.plugin(URLSlugs('name'));
module.exports = mongoose.model('BandVacancy', BandVacancySchema);