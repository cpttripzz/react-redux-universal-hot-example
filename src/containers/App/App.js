import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import { Navbar } from  'components';


@connect(
    state => ({
        user: state.auth.user,
        auth: state.auth
    }),
    {logout, pushState})
export default class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        user: PropTypes.object,

        logout: PropTypes.func.isRequired,
        pushState: PropTypes.func.isRequired
    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    };

    //componentWillReceiveProps(nextProps) {
    //    if (!this.props.user && nextProps.user) {
    //        // login
    //        window.localStorage.token = nextProps.user.token;
    //        this.props.pushState(null, '/loginSuccess');
    //    } else if (this.props.user && !nextProps.user) {
    //        // logout
    //        delete localStorage.token;
    //        this.props.pushState(null, '/');
    //    }
    //}
    componentWillMount() {
        if (Object.keys(this.props.user).length === 0) {
            if (typeof window !== "undefined" && typeof window.localStorage.token !== "undefined") {

                this.context.store.dispatch(loadAuth());
            }
        }
    }
    static fetchData(getState, dispatch) {
        const promises = [];

        if (!isAuthLoaded(getState())) {
            promises.push(dispatch(loadAuth()));
        }
        return Promise.all(promises);
    }


    render() {
        const {user} = this.props;
        const styles = require('./App.scss');
        return (
            <div className={styles.app}>
                <div className="container">
                    <Navbar user={this.props.user}></Navbar>
                </div>
                <div className={styles.appContent}>
                    {this.props.children}
                </div>

            </div>
        );
    }
}
