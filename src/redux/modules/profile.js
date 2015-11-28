const LOAD = 'redux-example/profile/LOAD';
const LOAD_SUCCESS = 'redux-example/profile/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/profile/LOAD_FAIL';
const SAVE = 'redux-example/profile/SAVE';
const SAVE_SUCCESS = 'redux-example/profile/SAVE_SUCCESS';
const SAVE_FAIL = 'redux-example/profile/SAVE_FAIL';
const initialState = {
  loaded: false,
  profile: {}
};

export default function profile(state = initialState, action = {}) {
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
        profile: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
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


  export function isLoaded(globalState) {
    return globalState && globalState.profile && globalState.profile.loaded;
  }

  export function load() {
    return {
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: (client) => client.get('/profile')
    };
  }

  export function post(profile) {
    return {
      types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
      id: profile.id,
      promise: (client) => client.post('/profile', {
        data: profile
      })
    };
  }
}
