const LOAD_USERS = 'redux-example/users/LOAD_USERS';
const LOAD_USERS_SUCCESS = 'redux-example/users/LOAD_USERS_SUCCESS';
const LOAD_USERS_FAIL = 'redux-example/users/LOAD_USERS_FAIL';
const EDIT_USERS_START = 'redux-example/users/EDIT_USERS_START';
const EDIT_USERS_STOP = 'redux-example/users/EDIT_USERS_STOP';
const SAVE_USERS = 'redux-example/users/SAVE_USERS';
const SAVE_USERS_SUCCESS = 'redux-example/users/SAVE_USERS_SUCCESS';
const SAVE_USERS_FAIL = 'redux-example/users/SAVE_USERS_FAIL';
const initialState = {
  loaded: false,
  users: false
};

export default function users(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_USERS:
      return {
        ...state,
        loading: true
      };
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        users: action.result
      };
    case LOAD_USERS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case EDIT_USERS_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_USERS_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case SAVE_USERS:
      return state; // 'saving' flag handled by redux-form
    case SAVE_USERS_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_USERS_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState && globalState.users && globalState.users.loaded;
}

export function load() {
  return {
    types: [LOAD_USERS, LOAD_USERS_SUCCESS, LOAD_USERS_FAIL],
    promise: (client) => client.get('/users')
  };
}