import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import {reducer as form} from 'redux-form';
import auth from './auth';
import users from './users';
import profile from './profile';
import register from './register';

export default combineReducers({
  routing: routeReducer,
  form,
  auth,
  users,
  profile,
  register,
});
