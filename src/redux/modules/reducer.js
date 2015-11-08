import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';

import auth from './auth';
import counter from './counter';
import {reducer as form} from 'redux-form';
import users from './users';
import profile from './profile';
export default combineReducers({
  router: routerStateReducer,
  auth,
  form,
  users,
  profile,
});
