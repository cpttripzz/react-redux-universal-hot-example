
const SAVE_PROFILE = 'redux-example/profile/SAVE_PROFILE';
const SAVE_PROFILE_SUCCESS = 'redux-example/profile/SAVE_PROFILE_SUCCESS';
const SAVE_PROFILE_FAIL = 'redux-example/profile/SAVE_PROFILE_FAIL';
const initialState = {
  loaded: false,
  profile: {}
};

export default function profile(state = initialState, action = {}) {
  switch (action.type) {

    case SAVE_PROFILE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        data: data,
      };
    case SAVE_PROFILE_FAIL:
      return {
        ...state,
      }
    default:
      return state;
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
