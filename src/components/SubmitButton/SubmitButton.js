import React, { Component, PropTypes } from 'react';
var classNames = require('classnames');

export default class SubmitButton extends Component {
  static propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool
  }


  render() {
    const { label, onClick, submitting, invalid } = this.props;
    const btnSubmitClass = classNames({
      'btn': true,
      'btn-primary': true
    });

    return (
      <button {...this.props} className={btnSubmitClass} onClick={onClick}>
        {!submitting && <i className="fa fa-key"/>}
        {submitting && <i className="fa fa-cog fa-spin"/>} {label}
      </button>
    )
  }
}