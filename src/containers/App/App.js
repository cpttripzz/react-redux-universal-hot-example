import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar } from  'components';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import { routeActions } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
let checkingAuth = false;

/*@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])*/


@connect(
  state => ({
    user: state.auth.user,
    auth: state.auth
  }),
  {pushState: routeActions.push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired
  };




  render() {

    const {user} = this.props

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