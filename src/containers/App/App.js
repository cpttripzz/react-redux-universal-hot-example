import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import { Navbar } from  'components';


@connect(
    state => ({
        user: state.auth.user,
        auth: state.auth
    }),
    {pushState})
export default class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        user: PropTypes.object,
        pushState: PropTypes.func.isRequired
    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (  (typeof this.props.user === "undefined"  || Object.keys(this.props.user).length === 0)
                && ( nextProps.user && Object.keys(nextProps.user).length)
                && typeof nextProps.user.token !== "undefined" && nextProps.user.token !== "undefined"
        )

        {
            // login
            window.localStorage.token = nextProps.user.token;
            const location = this.props.location ? this.props.location : '/';
            this.props.pushState(null, location);
        } else if (this.props.user && !nextProps.user) {
            delete localStorage.token;
            console.log('deleting',localStorage.token);
            this.props.pushState(null, '/');
        }
    }
    componentDidMount() {
        if (!this.props.user || Object.keys(this.props.user).length === 0) {
            if (typeof window !== "undefined" && typeof window.localStorage.token !== "undefined"
            &&  window.localStorage.token !== "undefined") {

                this.context.store.dispatch(loadAuth());
            }
        }
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
