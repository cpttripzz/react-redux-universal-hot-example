const LOAD = 'redux-example/profile/LOAD';
const LOAD_SUCCESS = 'redux-example/profile/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/profile/LOAD_FAIL';
const EDIT_START = 'redux-example/profile/EDIT_START';
const EDIT_STOP = 'redux-example/profile/EDIT_STOP';
const SAVE = 'redux-example/profile/SAVE';
const SAVE_SUCCESS = 'redux-example/profile/SAVE_SUCCESS';
const SAVE_FAIL = 'redux-example/profile/SAVE_FAIL';
const initialState = {
  loaded: false,
  profile: false
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


  export function isLoaded(globalState) {
    return globalState.profile && globalState.profile.loaded;
  }

  export function load() {
    return {
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: (client) => client.get('/profile') // params not used, just shown as demonstration
    };
  }

  export function save(profile) {
    return {
      types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
      id: profile.id,
      promise: (client) => client.post('/profile/update', {
        data: profile
      })
    };
  }

  export function editStart(id) {
    return {type: EDIT_START, id};
  }

  export function editStop(id) {
    return {type: EDIT_STOP, id};
  }
}
