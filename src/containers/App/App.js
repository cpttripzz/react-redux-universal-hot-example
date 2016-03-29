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
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object
  };

  constructor(props) {
    super(props)
    this.checkAuth = this.checkAuth.bind(this)
  }

  checkAuth() {
    if ((!this.props.user || !Object.keys(this.props.user).length) && !this.props.auth.loaded && !this.props.auth.loading && !checkingAuth) {
      checkingAuth = true
      this.context.store.dispatch(loadAuth()).then(() => {
        checkingAuth = false
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth()
  }

  componentDidMount() {
    this.checkAuth()
  }


  render() {

    const {user} = this.props
    const activeRoute = this.context.location.pathname

    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <div className="container">
          <Navbar activeRoute={activeRoute} user={this.props.user}></Navbar>
        </div>
        <div className={styles.appContent}>
          {this.props.children}
        </div>

      </div>
    );
  }
}