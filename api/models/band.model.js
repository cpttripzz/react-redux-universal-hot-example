let mongoose = require('mongoose')
let URLSlugs = require('mongoose-url-slugs')
let Schema = mongoose.Schema
let Association = mongoose.model('Association')
let Musician = mongoose.model('Musician')
let BandVacancy = mongoose.model('BandVacancy')


var BandSchema = new Schema({
  musician : { type: Schema.Types.ObjectId, ref: 'Musician' },
  BandVacancy : { type: Schema.Types.ObjectId, ref: 'BandVacancy' }
});


BandSchema.plugin(URLSlugs('name'));
module.exports = mongoose.model('Band', BandSchema);