import { Link } from 'react-router';
import { AlertAutoDismissable,ValidatedFormInput,SubmitButton } from 'components';
import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import { postProfile} from 'redux/modules/profile';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import { isLoaded as profileLoaded, load as loadProfile } from 'redux/modules/profile';

var classNames = require('classnames');
var Loader = require('react-loader');

export const fields = ['firstName','lastName', 'email', 'password', 'image'];

let propToValidate;
let validating = {};
const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }
  return errors;
};

@connect(state => ({user: state.validate}), {pushState})
export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.submitProfile = this.submitProfile.bind(this)
  }

  static propTypes = {
    fields: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!profileLoaded()) {
      promises.push(dispatch(loadProfile()));
    }
    return Promise.all(promises);
  }

  submitProfile(values, dispatch) {
    console.log('asdfdf');
    return new Promise((resolve, reject) => {
      dispatch(postProfile(values))
        .then(response => {
          if (response.error) {
            reject(response.error)
          }
        })
        .catch(err => reject(err))
    })



  }

  render() {
    const {
      error, submitting, invalid,
      fields: {firstName, lastName, email, password, image},
      resetForm, handleSubmit
      } = this.props;
    const styles = require('./Profile.scss');

    return (
      <div className={styles.profilePage}>
        <h1><span className="fa fa-user-secret"></span>Profile</h1>
        <div className="col-sm-6 col-sm-offset-3">
          <form className="profile-form" onSubmit={this.submitProfile}>
            <ValidatedFormInput field={email} />
            <ValidatedFormInput field={firstName} />
            <ValidatedFormInput field={lastName} />
            {error && <div>{error}</div>}
            <div>
              <SubmitButton label="Save Profile" submitting={submitting} onClick={handleSubmit(this.submitProfile)} />
              <button className="btn btn-warning" onClick={resetForm}>Clear Values</button>
            </div>
          </form>
        </div>
      </div>



    );
  }
}

export default reduxForm({
    form: 'profile',
    fields,
  },
  state => ({ // mapStateToProps
    initialValues: state.profile.data // will pull state into form's initialValues
  }),
  {load: loadProfile}
)(Profile);
