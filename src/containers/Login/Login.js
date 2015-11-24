import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import { isLoaded as isAuthLoaded, load as loadAuth,login } from 'redux/modules/auth';

import { pushState } from 'redux-router';

import { AlertAutoDismissable } from 'components';

@connect(
    state => ({
        user: state.auth.user,
        error: state.auth.loginError,
    }),
    {login, pushState})

export default class Login extends Component {
    static propTypes = {
        user: PropTypes.object,
        error: PropTypes.object,
        login: PropTypes.func,
        logout: PropTypes.func,
        pushState: PropTypes.func.isRequired
    }
    static contextTypes = {
        store: PropTypes.object.isRequired
    };



    //static fetchData(getState, dispatch) {
    //    const promises = [];
    //
    //    if (!isAuthLoaded(getState())) {
    //        promises.push(dispatch(loadAuth(getState())));
    //    }
    //    return Promise.all(promises);
    //}

    handleSubmit(event) {
        event.preventDefault();
        const email = this.refs.email;
        const password = this.refs.password;
        this.props.login(email.value, password.value);
        //input.value = '';
    }

    handleGoogleLogin(event) {
        event.preventDefault();
        window.location.href = 'http://bandaid.com:3030/oauth/google';
    }


    render() {
        const {user,error} = this.props;
        const styles = require('./Login.scss');
        const isLoggedIn = this.props.user && (Object.keys(this.props.user).length) ? true: false;

        return (

            <div className={styles.loginPage + ' container'}>
                <h1><span className="fa fa-sign-in"></span> Login</h1>
                {error &&
                <AlertAutoDismissable message={error.message} bsStyle="danger" ref="alertAuto"/>
                }
                {!isLoggedIn &&
                <div className="col-sm-6 col-sm-offset-3">
                    <form className="login-form" onSubmit={::this.handleSubmit}>
                        <div className="form-group">
                            <input type="text" className="form-control" ref="email" placeholder="Enter your email"/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" ref="password" placeholder="Enter your password"/>
                        </div>

                        <button className="btn btn-success" onClick={::this.handleSubmit}><i
                            className="fa fa-sign-in"/>{' '}Log
                            In
                        </button>
                        <button className="btn btn-success" onClick={::this.handleGoogleLogin}><i
                            className="fa fa-google"/>{' '}Log
                            in with Google
                        </button>
                    </form>
                    <p>Need an account? <Link to="/register">Register</Link></p>
                </div>
                }
            </div>
        );
    }

}
