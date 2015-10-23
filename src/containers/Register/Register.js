import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as authActions from 'redux/modules/auth';

import { AlertAutoDismissable } from 'components';

@connect(
    state => ({
    user: state.auth.user,
    error: state.auth.registerError,
  }),
    dispatch => bindActionCreators(authActions, dispatch)
)

export default class Register extends Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.object,
    register: PropTypes.func,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }


  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.email;  // need for getDOMNode() call going away in React 0.14
    const password = this.refs.password;  // need for getDOMNode() call going away in React 0.14
    this.props.register(email.value, password.value);
    //email.value = '';
    //password.value = '';
  }

  render() {
    const {user, error} = this.props;
    const styles = require('./Register.scss');
    return (
      <div className={styles.registerPage + ' container'}>
        <h1>Register</h1>
        {error &&
        <AlertAutoDismissable message={error.message} bsStyle="danger" ref="alertAuto"/>
        }
        <div>
          <form className="register-form" onSubmit={::this.handleSubmit}>
            <input type="text" ref="email" placeholder="Enter a email"/>
            <input type="password" ref="password" placeholder="Enter a Password"/>
            <button className="btn btn-success" onClick={::this.handleSubmit}><i className="fa fa-sign-in"/>{' '}Register</button>
          </form>
        </div>
      </div>
    );
  }
}
