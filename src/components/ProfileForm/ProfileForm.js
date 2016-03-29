import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import * as profileActions from 'redux/modules/profile';

@connect(
  state => ({
    saveError: state.profiles.saveError
  }),
  dispatch => bindActionCreators(profileActions, dispatch)
)
@reduxForm({
  form: 'profile',
  fields: ['firstName', 'lastName', 'username', 'email'],
})
export default class ProfileForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired
  };

  render() {
    const { editStop, fields: {id, color, sprocketCount, owner}, formKey, handleSubmit, invalid,
      pristine, save, submitting, saveError: { [formKey]: saveError }, values } = this.props;
    const styles = require('containers/Profile/Profile.scss');

    return (<form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">First Name</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="First Name" {...firstName}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Last Name</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="Last Name" {...lastName}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Email</label>
          <div className="col-xs-8">
            <input type="email" className="form-control" placeholder="Email" {...email}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Username</label>
          <div className="col-xs-8">
            <input type="username" className="form-control" placeholder="Username" {...username}/>
          </div>
        </div>
        <div>
          <button className="btn btn-default"
                  onClick={() => editStop(formKey)}
                  disabled={submitting}>
            <i className="fa fa-ban"/> Cancel
          </button>
          <button className="btn btn-success"
                  onClick={handleSubmit(() => save(values)
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(result.error);
                      }
                    })
                  )}
                  disabled={pristine || invalid || submitting}>
            <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
          </button>
          {saveError && <div className="text-danger">{saveError}</div>}
        </div>
      </form>
    );
  }
}
