const LOAD_PROFILE = 'redux-example/profile/LOAD_PROFILE';
const LOAD_PROFILE_SUCCESS = 'redux-example/profile/LOAD_PROFILE_SUCCESS';
const LOAD_PROFILE_FAIL = 'redux-example/profile/LOAD_PROFILE_FAIL';

const SAVE_PROFILE = 'redux-example/profile/SAVE_PROFILE';
const SAVE_PROFILE_SUCCESS = 'redux-example/profile/SAVE_PROFILE_SUCCESS';
const SAVE_PROFILE_FAIL = 'redux-example/profile/SAVE_PROFILE_FAIL';
const initialState = {
  loaded: false,
  profile: {}
};

export default function profile(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_PROFILE:
      return {
        ...state,
        loading: true
      };
    case LOAD_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case SAVE_PROFILE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        submitting: false,
        data: action.result
      };
    case SAVE_PROFILE_FAIL:
      return {
        ...state,
        submitting: false,
        error: action.error
      }
    default:
      return state;
  }

  export function isLoaded(globalState) {
    return globalState && globalState.profile && globalState.profile.loaded;
  }
  export function load() {
    return {
      types: [LOAD_PROFILE, LOAD_PROFILE_SUCCESS, LOAD_PROFILE_FAIL],
      promise: (client) => client.get('/profile')
    };
  }
  export function postProfile(values) {
    console.log(values)
    return {
      types: [SAVE_PROFILE, SAVE_PROFILE_SUCCESS, SAVE_PROFILE_FAIL],
      promise: (client) => client.post('/profile', {
        data: values
      })
    };
  }
}
