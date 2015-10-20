import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as authActions from 'redux/modules/auth';

import { AlertAutoDismissable } from 'components';

@connect(
    state => ({
        user: state.auth.user,
        error: state.auth.loginError,
    }),
    dispatch => bindActionCreators(authActions, dispatch)
)


export default class Login extends Component {
    static propTypes = {
        user: PropTypes.object,
        error: PropTypes.object,
        login: PropTypes.func,
        logout: PropTypes.func
    }
    constructor(props, context) {
        super(props, context);
    }

    static contextTypes = {
        router: React.PropTypes.object,
    }


    handleSubmit(event) {
        event.preventDefault();
        const email = this.refs.email.getDOMNode();
        const password = this.refs.password.getDOMNode();
        this.props.login(email.value, password.value);
        //input.value = '';
    }

    handleGoogleLogin(event) {
        event.preventDefault();
        window.location.href = 'http://bandaid.com:3030/oauth/google';
    }


    componentWillReceiveProps(nextProps) {
        if (!this.props.user && nextProps.user) {
            this.context.router.transitionTo('/');
        }
    }

    render() {
        const {user,error} = this.props;
        const styles = require('./Login.scss');

        return (

            <div className={styles.loginPage + ' container'}>
                <h1><span className="fa fa-sign-in"></span> Login</h1>
                {error &&
                <AlertAutoDismissable message={error.message} bsStyle="danger" ref="alertAuto"/>
                }
                {!user &&
                <div className="col-sm-6 col-sm-offset-3">
                    <form className="login-form" onSubmit={::this.handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="form-control" ref="email" placeholder="Enter your email"/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" ref="password"/>
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
