import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import * as profileActions from 'redux/modules/profile';
import { isLoaded as isProfileLoaded, load as loadProfile } from 'redux/modules/profile';


import {initializeWithKey} from 'redux-form';
import { ProfileForm } from 'components';

@connect(
  state => ({
    profile: state.profile.data,
    editing: state.profile.editing,
    error: state.profile.error,
    loading: state.profile.loading
  }),
  {...profileActions, initializeWithKey })
export default
class Profile extends Component {
  static propTypes = {
    profile: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  }

  static fetchDataDeferred(getState, dispatch) {
    if (!isProfileLoaded(getState())) {
      return dispatch(loadProfile());
    }
  }

  handleEdit(profile) {
    const {editStart} = this.props; // eslint-disable-line no-shadow
    return () => {
      editStart(String(profile.id));
    };
  }

  render() {
    const {profile, error, editing, loading, load} = this.props;
    console.log(this.props.profile);
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Profile.scss');
    return (
      <div className={styles.profile + ' container'}>
        <h1>
          Profile
          <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}><i
            className={refreshClassName}/> {' '} Reload Profile
          </button>
        </h1>
        <DocumentMeta title="React Redux Example: Profile"/>
        <p>
          If you hit refresh on your browser, the data loading will take place on the server before the page is returned.
          If you navigated here from another page, the data was fetched from the client after the route transition.
          This uses the static method <code>fetchDataDeferred</code>. To block a route transition until some data is loaded, use <code>fetchData</code>.
          To always render before loading data, even on the server, use <code>componentDidMount</code>.
        </p>
        <p>
          This profile are stored in your session, so feel free to edit it and refresh.
        </p>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {profile &&
        <ProfileForm formKey={String(profile.id)} key={String(profile.id)} initialValues={profile}/>
        }
      </div>
    );
  }
}

