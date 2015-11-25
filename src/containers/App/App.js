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
    if ( (!this.props.user || Object.keys(this.props.user).length === 0) && this.props.auth.loaded === false && !this.props.auth.loading) {
      if (typeof window !== "undefined" && typeof window.localStorage.token !== "undefined"
        && window.localStorage.token !== "undefined") {
        this.context.store.dispatch(loadAuth());
      }
    }
  }

  componentDidMount() {
    if ( (!this.props.user || Object.keys(this.props.user).length === 0) && this.props.auth.loaded === false && !this.props.auth.loading) {
      if (typeof window !== "undefined" && typeof window.localStorage.token !== "undefined"
        && window.localStorage.token !== "undefined") {
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
