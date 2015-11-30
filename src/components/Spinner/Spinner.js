import React, { Component, PropTypes } from 'react';
var Loader = require('react-loader');

export default class Spinner extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired
  }


  render() {
    const defaultOptions = {
      speed: 1,
      trail: 60,
      color: '#2A9FD6',
      shadow: false,
      hwaccel: true,
      scale: 0.5,
      position: 'relative',
      display: 'inline-block',
      left: '100%'
    };
    const { options } = this.props;
    const spinnerOptions = Object.assign(options, defaultOptions);
    return (<Loader options={spinnerOptions} />)
  }
}