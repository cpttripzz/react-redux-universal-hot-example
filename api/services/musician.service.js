let mongoose = require('mongoose')
mongoose.Promise = Promise
let Musician = mongoose.model('Musician')

export function getMusicians(params={}){
  return Musician.find(params).populate('user genres addresses.country').lean()
}