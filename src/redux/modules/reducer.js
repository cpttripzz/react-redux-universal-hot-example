import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import {reducer as form} from 'redux-form';
import auth from './auth';
import users from './users';
import profile from './profile';
import validate from './validate';

export default combineReducers({
  router: routerStateReducer,
  form,
  auth,
  users,
  profile,
  validate,
});
