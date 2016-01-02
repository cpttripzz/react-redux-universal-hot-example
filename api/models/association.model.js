let mongoose = require('mongoose');
let URLSlugs = require('mongoose-url-slugs');
let Schema = mongoose.Schema;
let Genre = mongoose.model('Genre');
let Address = mongoose.model('Address');
let Document = mongoose.model('Document');
let Country = mongoose.model('Country');

let AssociationSchema = new Schema({
  name: {type: String, trim: true},
  description: {type: String, trim: true},
  genres : { type: Schema.Types.ObjectId, ref: 'Genre' },
  addresses : { type: Schema.Types.ObjectId, ref: 'Address' },
  documents : { type: Schema.Types.ObjectId, ref: 'Document' },
  user : { type: Schema.Types.ObjectId, ref: 'User' },

});


AssociationSchema.plugin(URLSlugs('name'));
module.exports = mongoose.model('Association', AssociationSchema);