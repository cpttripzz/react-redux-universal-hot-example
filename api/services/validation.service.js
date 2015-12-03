export function validateEntityProps(type, entity) {
  const schemaPath = __dirname + '/../models/validators/' + type +'.schema.json'
  import validate from  '../../utils/validate'
  var readFile = require("bluebird").promisify(require("fs").readFile)
  console.log('2', type, entity)
  return new Promise((resolve, reject) => {
    console.log('ffff',schemaPath)
    readFile(schemaPath)
      .then((schema) => { console.log('3',schema); return JSON.parse(schema)})
      .then((schema) => { console.log('4',schema); return validate(entity, schema)} )
      .then((user) => { console.log('5',user) ;return resolve(user)})
      .catch((err) =>  reject(err))
  });
}

export function getValidateEntityErrors(err) {
  let errors = {}
  err.map(err => {
    errors[err.path.replace(/\#\//i, '')] = err.message
  })
  return errors
}