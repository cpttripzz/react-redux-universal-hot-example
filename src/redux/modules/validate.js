const VALIDATE = 'redux-example/auth/VALIDATE';
const VALIDATE_TRUE = 'redux-example/auth/VALIDATE_TRUE';
const VALIDATE_FALSE = 'redux-example/auth/VALIDATE_FALSE';


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
  };


}