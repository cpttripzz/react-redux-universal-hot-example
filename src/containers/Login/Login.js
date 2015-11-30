import { Link } from 'react-router';
import { AlertAutoDismissable,ValidatedFormInput } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import { login } from 'redux/modules/auth';

var classNames = require('classnames');
var Loader = require('react-loader');

export const fields = ['username', 'password'];

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


@connect(state => ({validate: state.validate}), {pushState})
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.submitLogin = this.submitLogin.bind(this)
  }

  static propTypes = {
    fields: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    validateParams: PropTypes.func,
    login: PropTypes.func,
    pushState: PropTypes.func.isRequired
  };

  submitLogin(values, dispatch, _props) {
    return new Promise((resolve, reject) => {
      dispatch(login(values))
        .then(response => {
          if (response.error) {
            reject({_error: response.error.message})
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

  handleGoogleLogin(event) {
    event.preventDefault();
    window.location.href = 'http://bandaid.com:3030/oauth/google';
  }

  render() {
    const {
      error, submitting, invalid,
      fields: {username, password},
      resetForm, handleSubmit
      } = this.props;
    const styles = require('./Login.scss');
    const btnSubmitClass = classNames({
      'btn': true,
      'btn-primary': true,
      'disabled': invalid
    });
    return (
      <div className={styles.loginPage}>
        <h1><span className="fa  fa-sign-in"></span> Login</h1>
        <div className="col-sm-6 col-sm-offset-3">
          <form className="login-form" onSubmit={this.submitLogin}>
            {error &&  <AlertAutoDismissable message={error} bsStyle="danger" ref="alertAuto"/>}
            <ValidatedFormInput field={username} />
            <ValidatedFormInput field={password} fieldProps={ {type: 'password'} }/>
            <div>
              <button className={btnSubmitClass} onClick={handleSubmit(this.submitLogin)}>
                {!submitting && <i className="fa fa-key"/>}
                {submitting && <i className="fa fa-cog fa-spin"/>} Login
              </button>
              <button className="btn btn-success" onClick={::this.handleGoogleLogin}><i
                className="fa fa-google"/>{' '}Log
                in with Google
              </button>
              <button className="btn btn-warning" onClick={resetForm}>Clear Values</button>
            </div>
          </form>
          <p>Need an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'login',
  fields,
  validate
})(Login);
