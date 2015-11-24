const VALIDATE = 'redux-example/register/VALIDATE';
const VALIDATE_TRUE = 'redux-example/register/VALIDATE_TRUE';
const VALIDATE_FALSE = 'redux-example/register/VALIDATE_FALSE';
const REGISTER = 'redux-example/register/REGISTER';
const REGISTER_TRUE = 'redux-example/register/REGISTER_TRUE';
const REGISTER_FALSE = 'redux-example/register/REGISTER_FALSE';

export default function reducer(state = {}, action = {}) {

  switch (action.type) {

    case VALIDATE:
      return {
        ...state,
      };
    case VALIDATE_TRUE:
      return {
        ...state,
      };
    case VALIDATE_FALSE:
      return {
        ...state,
        error: action.error
      };
    case REGISTER:
      return {
        ...state,
      };
    case REGISTER_TRUE:
      return {
        ...state,
      };
    case REGISTER_FALSE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}

export function validate(values) {
  return {
    types: [VALIDATE, VALIDATE_TRUE, VALIDATE_FALSE],
    promise: (client) => client.post('/exists/user', {
      data: values

    })
  }
}

export function register(values) {
  return {
    types: [REGISTER, REGISTER_TRUE, REGISTER_FALSE],
    promise: (client) => client.post('/user/new', {
      data: values
    })
  }
}