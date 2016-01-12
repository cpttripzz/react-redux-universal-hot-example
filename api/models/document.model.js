var mongoose = require('mongoose'),
  URLSlugs = require('mongoose-url-slugs'),
  Schema = mongoose.Schema;

var DocumentSchema = new Schema({
  name: {type: String, trim: true},
  type: {type: String, trim: true},
  extension: {type: String, trim: true},
  path: {type: String, trim: true}
});

DocumentSchema.plugin(URLSlugs('name'));
module.exports = mongoose.model('Document', DocumentSchema);