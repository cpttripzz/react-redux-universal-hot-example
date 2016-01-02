import { Link } from 'react-router';
import { AlertAutoDismissable,ValidatedFormInput,SubmitButton } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import { validate as validateParams, register} from 'redux/modules/register';
import {connect} from 'react-redux';
import { pushPath } from 'redux-simple-router';
import cookie from '../../../utils/cookie';

var classNames = require('classnames');
var Loader = require('react-loader');

export const fields = ['username', 'email', 'password'];

let propToValidate;
let validating = {};
const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

const asyncValidate = (values, dispatch, _props) => {
  const propToValidate = _props.form._active;
  Object.keys(values).forEach((key) => {
    if (values[key] && values[key].length < 3) delete values[key]
  })
  return new Promise((resolve, reject) => {
      if (!Object.keys(values).length) return resolve();
      validating[[propToValidate]] = true
      dispatch(validateParams(values))
        .then(response => {
          validating[[propToValidate]] = false
          if (response.error) return reject(response.error);

          return resolve();
        })
        .catch(err => reject(err))
    }
  )
}

@connect(state => ({validate: state.validate}), {pushPath})
export default class Register extends Component {
  constructor(props) {
    super(props)
    this.submitRegister = this.submitRegister.bind(this)
  }

  static propTypes = {
    fields: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    validateParams: PropTypes.func,
    pushPath: PropTypes.func.isRequired
  };

  submitRegister(values, dispatch, _props) {
    const errors = {};
    return new Promise((resolve, reject) => {
      dispatch(register(values))
        .then(response => {
          if (response.error) {
            reject(response.error)
          } else {
            cookie.setToken(response.result.token)
            this.props.pushPath(null, '/')
            resolve()
          }

        })
        .catch(err => reject(err))
    })
  }

  render() {
    const {
      error, submitting, invalid,
      fields: {username, email, password},
      resetForm, handleSubmit
      } = this.props;
    const styles = require('./Register.scss');

    return (
      <div className={styles.registerPage}>
        <h1><span className="fa fa-user-plus"></span> Sign up</h1>
        <div className="col-sm-6 col-sm-offset-3">
          <form className="login-form" onSubmit={this.submitRegister}>
            <ValidatedFormInput field={username} validating={validating.username} spinnerOptions={ {top: '18px'} }/>
            <ValidatedFormInput field={email} validating={validating.email} spinnerOptions={ {top: '67px'} }/>
            <ValidatedFormInput type="password" field={password}/>
            {error && <div>{error}</div>}
            <div>
              <SubmitButton label="Register" submitting={submitting} invalid={invalid}
                            onClick={handleSubmit(this.submitRegister)}/>
              <button className="btn btn-warning" onClick={resetForm}>Clear Values</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'register',
  fields,
  asyncValidate,
  asyncBlurFields: ['username', 'email'],
  validate
})(Register);
