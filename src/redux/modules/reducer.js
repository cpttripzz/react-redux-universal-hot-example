import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import auth from './auth';
import users from './users';
import profile from './profile';
import register from './register';
import bands from './bands';

export default combineReducers({
  routing: routeReducer,
  form: formReducer,
  reduxAsyncConnect,
  auth,
  users,
  profile,
  register,
  bands
});
