const LOAD_BAND = 'redux-example/band/LOAD_BAND';
const LOAD_BAND_SUCCESS = 'redux-example/band/LOAD_BAND_SUCCESS';
const LOAD_BAND_FAIL = 'redux-example/band/LOAD_BAND_FAIL';

const SAVE_BAND = 'redux-example/band/SAVE_BAND';
const SAVE_BAND_SUCCESS = 'redux-example/band/SAVE_BAND_SUCCESS';
const SAVE_BAND_FAIL = 'redux-example/band/SAVE_BAND_FAIL';
const initialState = {
  loaded: false,
  band: {}
};

export default function band(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_BAND:
      return {
        ...state,
        loading: true
      };
    case LOAD_BAND_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_BAND_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case SAVE_BAND:
      return state; // 'saving' flag handled by redux-form
    case SAVE_BAND_SUCCESS:
      return {
        ...state,
        submitting: false,
        data: action.result
      };
    case SAVE_BAND_FAIL:
      return {
        ...state,
        submitting: false,
        error: action.error
      }
    default:
      return state;
  }
}
export function isLoaded(globalState) {
  return globalState && globalState.band && globalState.band.loaded;
}
export function load() {
  return {
    types: [LOAD_BAND, LOAD_BAND_SUCCESS, LOAD_BAND_FAIL],
    promise: (client) => client.get('/band')
  };
}
export function postBand(values) {
  return {
    types: [SAVE_BAND, SAVE_BAND_SUCCESS, SAVE_BAND_FAIL],
    promise: (client) => client.post('/band', {
      data: values
    })
  };
}
