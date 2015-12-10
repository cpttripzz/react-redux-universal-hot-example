import { Link } from 'react-router';
import { AlertAutoDismissable,ValidatedFormInput,SubmitButton } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import { login } from 'redux/modules/auth';
let equals = require('shallow-equals')
export const fields = ['username', 'password']

import cookie from '../../../utils/cookie';

let showSubmitErrors = true
const validate = values => {
  const errors = {};
  Object.keys(values).forEach(key => {
    if (!values[key]) errors[key] = 'Required'
  })
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
            console.log('err',response.error.message)
            reject({_error: response.error.message})
          } else {
            if (typeof window !== "undefined") {
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                cookie.set({
                  name: 'token',
                  value: response.result.token,
                  expires
                });
              }
            }
            this.props.pushState(null, '/')

        })
        .catch(err => reject(err))
    })
  }


  componentWillReceiveProps(nextProps) {
    if( ! equals(this.props.values,nextProps.values) ) { showSubmitErrors = true }

    if( showSubmitErrors && this.props.submitting && this.refs && this.refs.alertAuto) {
      this.refs.alertAuto.setState({isVisible: true})
      showSubmitErrors = false
    }
  }

  handleGoogleLogin(event) {
    event.preventDefault();
    window.location.href = 'http://bandaid.com:3030/oauth/google';
  }

  render() {
    const {
      error, submitting, invalid, pristine,
      fields: {username, password},
      resetForm, handleSubmit
      } = this.props;
    const styles = require('./Login.scss');
    return (
      <div className={styles.loginPage}>
        <h1><span className="fa  fa-sign-in"></span> Login</h1>
        <div className="col-sm-6 col-sm-offset-3">
          <form className="login-form" onSubmit={this.submitLogin}>
            { error && <AlertAutoDismissable message={error} bsStyle="danger" ref="alertAuto"/>}
            <ValidatedFormInput field={username}/>
            <ValidatedFormInput type="password" field={password}/>
            <div>
             <SubmitButton label="Login" submitting={submitting} invalid={invalid} onClick={handleSubmit(this.submitLogin)} />
              <button className="btn btn-success" onClick={this.handleGoogleLogin}><i
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
