import { Link } from 'react-router';
import { AlertAutoDismissable,ValidatedFormInput,SubmitButton } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';

import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
import { login } from 'redux/modules/auth';
import cookie from '../../../utils/cookie';
let equals = require('shallow-equals')
export const fields = ['username', 'password']


let showSubmitErrors = true
const validate = values => {
  const errors = {};
  Object.keys(values).forEach(key => {
    if (!values[key]) errors[key] = 'Required'
  })
  return errors;
};


@connect(state => ({validate: state.validate}), {pushState: routeActions.push})

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
            cookie.setToken(response.token)
            this.props.pushState('/')
            resolve()
          }
        })
        .catch(err => reject({_error: err.message}))
    })
  }


  componentWillReceiveProps(nextProps) {
    if (!equals(this.props.values, nextProps.values)) {
      showSubmitErrors = true
    }

    if (showSubmitErrors && this.props.submitting && this.refs && this.refs.alertAuto) {
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
    console.log('error',error);
    return (
      <div className={styles.loginPage}>
        <h1><span className="fa  fa-sign-in"></span> Login</h1>
        <div className="col-sm-6 col-sm-offset-3">
          <form className="login-form" onSubmit={handleSubmit(this.submitLogin)}>
            { error && <div className="has-error">{error}</div>}
            <ValidatedFormInput field={username}/>
            <ValidatedFormInput type="password" field={password}/>
            <div>
              <SubmitButton label="Login" submitting={submitting} invalid={invalid} />
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
