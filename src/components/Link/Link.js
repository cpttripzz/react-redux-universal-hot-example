import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { routeActions } from 'react-router-redux';
import { logout } from 'redux/modules/auth';

export default class Link extends Component {
  static propTypes = {
    to: PropTypes.string,
    className:  PropTypes.string,
    activeRoute:  PropTypes.string,
    component:  PropTypes.Object,
    children:  PropTypes.Array,
  }



  render() {
    {to, className, activeRoute, component, children} = this.props
    const Comp = component || Link;
    if (to==activeRoute) className += className + " active"
    const isLoggedIn = this.props.user && (Object.keys(this.props.user).length) ? true: false
    const photoPath = false; //isLoggedIn ? 'thumbs/' + this.props.user._id + '.png' : false
    const { activeRoute } = this.props
    return (
      <Comp to={to} className={className}>
        {children}
      </Comp>
    );
  }
}