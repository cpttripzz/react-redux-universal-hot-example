const LOAD = 'redux-example/users/LOAD';
const LOAD_SUCCESS = 'redux-example/users/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/users/LOAD_FAIL';
const EDIT_START = 'redux-example/users/EDIT_START';
const EDIT_STOP = 'redux-example/users/EDIT_STOP';
const SAVE = 'redux-example/users/SAVE';
const SAVE_SUCCESS = 'redux-example/users/SAVE_SUCCESS';
const SAVE_FAIL = 'redux-example/users/SAVE_FAIL';
const initialState = {
  loaded: false,
  users: false
};

export default function users(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        users: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
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
    case SAVE_FAIL:
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
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/users') // params not used, just shown as demonstration
  };
}