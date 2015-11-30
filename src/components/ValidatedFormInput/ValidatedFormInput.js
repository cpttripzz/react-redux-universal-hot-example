import React, { Component, PropTypes } from 'react'
import { Spinner } from 'components'
import { ucFirst } from '../../../utils/stringUtils'

export default class ValidatedFormInput extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    fieldProps: PropTypes.object.isRequired,
    validating: PropTypes.bool.isRequired,
    spinnerOptions: PropTypes.object.isRequired
  }

  render() {
    const { field, fieldProps, validating, spinnerOptions } = this.props;
    console.log(this.props);
    return (
      <div>
        <div className={'form-group' + (field.touched && field.error ? ' has-error' : '')}>
          <input type='text' className={field.name +' form-control'} placeholder={fieldProps.placeholder || ucFirst(field.name)} {...field} />
          {validating && <Spinner options={spinnerOptions} />}

        </div>
        {field.touched && field.error && <div className='help-block'>{field.error}</div>}
      </div>
    );
  }
}