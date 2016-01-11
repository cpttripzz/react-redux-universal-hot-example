export function getMusicians(params){
  let Musician = mongoose.model('Musician')
  Musician.find({}).populate('user ', 'name')
    .lean().then(musicians => musicians)
}