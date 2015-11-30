import { Link } from 'react-router';
import { AlertAutoDismissable,ValidatedFormInput } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import { validate as validateParams, register} from 'redux/modules/register';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';

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
  if (values[propToValidate]) validating[[propToValidate]] = true
  return new Promise((resolve, reject) => {
    dispatch(validateParams(values))
      .then(response => {
        validating[[propToValidate]] = false
        if (response.error) return reject(response.error);

        return resolve();
      })
      .catch(err => reject(err))
  })
}

@connect(state => ({validate: state.validate}), {pushState})
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
    register: PropTypes.func,
    pushState: PropTypes.func.isRequired
  };

  submitRegister(values, dispatch, _props) {
    const errors = {};
    return new Promise((resolve, reject) => {
      dispatch(register(values))
        .then(response => {
          if (response.error) {
            reject(response.error)
          } else {
            if (typeof window !== "undefined") {
              window.localStorage.token = response.result.token
            }
            this.props.pushState(null, '/')
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
    const btnSubmitClass = classNames({
      'btn': true,
      'btn-primary': true,
      'disabled': invalid
    });
    return (
      <div className={styles.registerPage}>
        <h1><span className="fa fa-user-plus"></span> Sign up</h1>
        <div className="col-sm-6 col-sm-offset-3">
          <form className="login-form" onSubmit={this.submitRegister}>
            <ValidatedFormInput field={username} fieldProps={ {name: 'username'} } validating={validating.username} spinnerOptions={ {top: '18px'} } />
            <ValidatedFormInput field={email} fieldProps={ {name: 'email'} } validating={validating.email} spinnerOptions={ {top: '67px'} } />
            <ValidatedFormInput field={password} fieldProps={ {name: 'password'} } validating={validating.password}  />
            {error && <div>{error}</div>}
            <div>
              <button className={btnSubmitClass} onClick={handleSubmit(this.submitRegister)}>
                {!submitting && <i className="fa fa-key"/>}
                {submitting && <i className="fa fa-cog fa-spin"/>} Register
              </button>
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
