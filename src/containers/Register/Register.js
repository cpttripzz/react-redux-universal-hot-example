import { Link } from 'react-router';
import { AlertAutoDismissable } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import { validateUsername} from 'redux/modules/validate';

import {connect} from 'react-redux';


export const fields = ['username', 'email', 'password'];

let propToValidate;
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

const asyncValidate = (values, dispatch, aa) => {
  //let params = []
  //for (let v in values) {
  //  if (values[v]) {
  //    params.push
  //  }
  //}
  //console.log(this.props.active);
  //const val = values.filter((v) =>  typeof v !== );
  return new Promise((resolve,reject) => {
    dispatch(validateUsername(values))
      .then(response => {
        const msg = propToValidate + ' already in use';
        propToValidate = 'username';
        if (response) {
          return reject({[propToValidate]: msg, _error: msg});
        }
        return resolve();
      })
  })
}

@connect( state => ({validate: state.validate}))
export default class Register extends Component {

  handleSubmit(event) {
    event.preventDefault();
    const username = this.refs.username;
    const email = this.refs.email;
    const password = this.refs.password;
    this.props.register(username.value, email.value, password.value);
    //email.value = '';
    //password.value = '';
  }
  static propTypes = {
    fields: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    validateParams: PropTypes.func,
    validate: PropTypes.object.isRequired
  };

  render() {
    const {validate, fields: {username, email, password}, resetForm, handleSubmit} = this.props;
    const styles = require('./Register.scss');
    console.log(this.props);
    return (
      <form  className="form col-md-4" onSubmit={handleSubmit}>
        <div className={'form-group' + (username.touched && username.error ? ' has-error' : '')}>
          <input type="text" className="username form-control" placeholder="Username" {...username}/>
          {validate.validatingUsername && <i className="fa fa-cog fa-spin" />}
        </div>
        {username.touched && username.error && <div className="help-block">{username.error}</div>}
        <div className={'form-group' + (email.touched && email.error ? ' has-error' : '')}>
          <input type="text" className="form-control" placeholder="Email" {...email}/>
          {false && <i className="fa fa-cog fa-spin" /* spinning cog */ style={{
              position: 'absolute',
              right: 25,
              top: 10
            }}/>}
        </div>
        {email.touched && email.error && <div className="help-block">{email.error}</div>}

        <div className={'form-group' + (password.touched && password.error ? ' has-error' : '')}>
          <input type="text" className="form-control" placeholder="Password" {...password}/>
          {false && <i className="fa fa-cog fa-spin" /* spinning cog */ style={{
              position: 'absolute',
              right: 25,
              top: 10
            }}/>}
        </div>
        {password.touched && password.error && <div className="help-block">{password.error}</div>}


        <div className="text-center">
          <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Sign Up</button>
          <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Clear Values</button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'register',
  fields,
  asyncValidate,
  asyncBlurFields: ['username'],
  validate
})(Register);
