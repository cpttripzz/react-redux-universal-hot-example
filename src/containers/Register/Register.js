import { Link } from 'react-router';
import { AlertAutoDismissable } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import { validate as validateParams, register} from 'redux/modules/register';
import {connect} from 'react-redux';
import {classnames as classNames} from 'classnames';
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

const submitRegister = (values, dispatch, _props) => {
  return new Promise((resolve, reject) => {
    dispatch(register(values))
      .then(response => {
        if (response.error) return reject(response.error);
        return resolve();
      })
      .catch(err => reject(err))
  })
}


@connect(state => ({validate: state.validate}))
export default class Register extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    validateParams: PropTypes.func,
    register: PropTypes.func,
    validate: PropTypes.object.isRequired
  };

  render() {
    const {
      validate, error, submitting,
      fields: {username, email, password},
      resetForm, handleSubmit
    } = this.props;
    const styles = require('./Register.scss');
    var options = {
      speed: 1,
      trail: 60,
      color: '#2A9FD6',
      shadow: false,
      hwaccel: true,
      scale: 0.5,
      position: 'relative',
      display: 'inline-block',
      left: '100%'
    };
    let usernameSpinnerOptions = Object.assign({top:'18px'}, options);
    let emailSpinnerOptions = Object.assign({top:'67px'}, options);
    return (

      <div className={styles.registerPage}>
        <h1><span className="fa fa-user-plus"></span> Sign up</h1>
        <div className="col-sm-6 col-sm-offset-3">
          <form className="login-form" onSubmit={submitRegister}>
            <div className={'form-group' + (username.touched && username.error ? ' has-error' : '')}>
              <input type="text" className="username form-control" placeholder="Username" {...username}/>
                {validating.username && <Loader options={usernameSpinnerOptions} />}
            </div>
            {username.touched && username.error && <div className="help-block">{username.error}</div>}
            <div className={'form-group' + (email.touched && email.error ? ' has-error' : '')}>
              <input type="text" className="form-control" placeholder="Email" {...email}/>
              {validating.email && <Loader options={emailSpinnerOptions} />}
            </div>
            {email.touched && email.error && <div className="help-block">{email.error}</div>}
            <div className={'form-group' + (password.touched && password.error ? ' has-error' : '')}>
              <input type="text" className="form-control" placeholder="Password" {...password}/>
            </div>
            {password.touched && password.error && <div className="help-block">{password.error}</div>}

            {error && <div>{error}</div>}
            <div>
              <button className = "btn btn-primary" onClick={handleSubmit(submitRegister)}>
                {!submitting && <i/> /* key icon */}
                {submitting && <i/> /* spinning cog icon */} Register
              </button>
              <button className = "btn btn-warning" onClick={resetForm}>Clear Values</button>
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
  asyncValidateReturnActiveFieldOnly: true,
  validate
})(Register);
