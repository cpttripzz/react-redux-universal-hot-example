const LOAD_BANDS = 'redux-example/bands/LOAD_BANDS';
const LOAD_BANDS_SUCCESS = 'redux-example/bands/LOAD_BANDS_SUCCESS';
const LOAD_BANDS_FAIL = 'redux-example/bands/LOAD_BANDS_FAIL';

const initialState = {
  loaded: false,
  bands: {}
};

export default function bands(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_BANDS:
      return {
        ...state,
        loading: true
      };
    case LOAD_BANDS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_BANDS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}
export function isLoaded(globalState) {
  console.log('isLoaded')
  return globalState && globalState.bands && globalState.bands.loaded;
}
export function load() {
  console.log('fdfdf');
  return {
    types: [LOAD_BANDS, LOAD_BANDS_SUCCESS, LOAD_BANDS_FAIL],
    promise: (client) => client.get('/bands')
  };
}
