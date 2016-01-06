let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Association = mongoose.model('Association')
let MusicianSchema = new Schema({
  bands : { type: Schema.Types.ObjectId, ref: 'Band' },
  instruments : { type: Schema.Types.ObjectId, ref: 'Instrument' }
});
let Musician = Association.discriminator('Musician',MusicianSchema);

module.exports = mongoose.model('Musician', Musician);