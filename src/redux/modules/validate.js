const VALIDATE_USERNAME = 'redux-example/auth/VALIDATE_USERNAME';
const VALIDATE_USERNAME_TRUE = 'redux-example/auth/VALIDATE_USERNAME_TRUE';
const VALIDATE_USERNAME_FALSE = 'redux-example/auth/VALIDATE_USERNAME_FALSE';
const VALIDATE_EMAIL = 'redux-example/auth/VALIDATE_EMAIL';
const VALIDATE_EMAIL_TRUE = 'redux-example/auth/VALIDATE_EMAIL_TRUE';
const VALIDATE_EMAIL_FALSE = 'redux-example/auth/VALIDATE_EMAIL_FALSE';

const initialState = {
  validatingUsername: false,
  validatingEmail: false,
};
export default function reducer(state = initialState, action = {}) {

  switch (action.type) {

    case VALIDATE_USERNAME:
      return {
        ...state,
        validatingUsername: true
      };
    case VALIDATE_USERNAME_TRUE:
      return {
        ...state,
        validatingUsername: false,
        validUsername: true
      };
    case VALIDATE_USERNAME_FALSE:
      return {
        ...state,
        validatingUsername: false,
        validUsername: false,
        error: action.error
      };
    case VALIDATE_EMAIL:
      return {
        ...state,
        validatingEmail: true
      };
    case VALIDATE_EMAIL_TRUE:
      return {
        ...state,
        validatingEmail: false,
        validEmail: true
      };
    case VALIDATE_EMAIL_FALSE:
      return {
        ...state,
        validatingEmail: false,
        validEmail: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function validate(prop,value) {
  const params = {[prop]: value};
  switch (prop){
    case "username":
      return {
        types: [VALIDATE_USERNAME,VALIDATE_USERNAME_TRUE,VALIDATE_USERNAME_FALSE],
        promise: (client) => client.post('/exists/user', {
          data: params

        })
      };
    case "email":
      return {
        types: [VALIDATE_EMAIL,VALIDATE_EMAIL_TRUE,VALIDATE_EMAIL_FALSE],
        promise: (client) => client.post('/exists/user', {
          data: params
        })
      };

  }
  
}