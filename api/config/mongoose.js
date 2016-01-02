var config = require('../config');
var mongoose = require('mongoose');
//['user','country','city','genre','instrument','association','band','musician']
module.exports = function() {
	var db = mongoose.connect(config.db);
	['user'].forEach( (model) => {
		require('../models/'+model+'.model.js');
	})
	return db;
};