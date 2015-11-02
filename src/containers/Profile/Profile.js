import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['firstName', 'lastName', 'username', 'email'];

class SimpleForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };

  render() {
    const {
        fields: {firstName, lastName, username, email},
        handleSubmit,
        resetForm
        } = this.props;
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
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={resetForm}>Clear Values</button>
          </div>
        </form>
    );
  }
}

export default reduxForm({
  form: 'simple',
  fields
})(SimpleForm);