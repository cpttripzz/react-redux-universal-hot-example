import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

@connect( state => ({}), {pushState})
export default class OauthToken extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (this.props.routeParams.token) {
      if (typeof window !== "undefined") {
        window.localStorage.token = this.props.routeParams.token;
        this.props.pushState(null, '/profile');
      }
    }
  }

  render() {
    return (
      <div className="container">
      </div>
    );
  }
}
