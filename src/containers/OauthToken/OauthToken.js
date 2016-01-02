import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import cookie from '../../../utils/cookie';

@connect( state => ({}), {pushPath})
export default class OauthToken extends Component {
  static propTypes = {
    pushPath: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (this.props.routeParams.token) {
      cookie.setToken(this.props.routeParams.token)
      this.props.pushPath(null, '/profile');
    }
  }

  render() {
    return (
      <div className="container">
      </div>
    );
  }
}
