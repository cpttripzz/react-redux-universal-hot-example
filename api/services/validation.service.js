export function validateEntityProps(type, entity) {
  const schemaPath = __dirname + '/../models/validators/' + type +'.schema.json'
  import validate from  '../../utils/validate'
  var readFile = require("bluebird").promisify(require("fs").readFile)
  return new Promise((resolve, reject) => {
    readFile(schemaPath)
      .then((schema) => JSON.parse(schema))
      .then((schema) => validate(entity, schema))
      .then((user) => resolve(user))
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